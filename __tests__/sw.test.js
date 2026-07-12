const fs = require('fs');
const path = require('path');

const swSource = fs.readFileSync(
  path.join(__dirname, '../public/sw.js'),
  'utf8'
);

// public/sw.js is a plain service-worker script (not a module) that relies on
// the `self`, `caches` and `fetch` globals provided by the service worker
// runtime. To unit test it in isolation we evaluate its source in a sandboxed
// function, injecting mock implementations of those globals and capturing the
// event listeners it registers so we can invoke them directly.
function loadServiceWorker() {
  const listeners = {};

  const selfMock = {
    addEventListener: jest.fn((type, handler) => {
      listeners[type] = handler;
    }),
    skipWaiting: jest.fn(),
  };

  const cachesMock = {
    keys: jest.fn(),
    open: jest.fn(),
    match: jest.fn(),
  };

  const fetchMock = jest.fn();

  // eslint-disable-next-line no-new-func
  const evaluate = new Function('self', 'caches', 'fetch', 'URL', swSource);
  evaluate(selfMock, cachesMock, fetchMock, URL);

  return { listeners, selfMock, cachesMock, fetchMock };
}

function createRequest(url, method = 'GET') {
  return { url, method };
}

describe('public/sw.js', () => {
  const cacheNameMatch = swSource.match(/const CACHE\s*=\s*"([^"]+)"/);
  const CACHE_NAME = cacheNameMatch ? cacheNameMatch[1] : undefined;

  it('declares a cache name constant', () => {
    expect(CACHE_NAME).toBeDefined();
    expect(typeof CACHE_NAME).toBe('string');
  });

  it('registers install, activate and fetch listeners', () => {
    const { listeners } = loadServiceWorker();

    expect(listeners.install).toBeInstanceOf(Function);
    expect(listeners.activate).toBeInstanceOf(Function);
    expect(listeners.fetch).toBeInstanceOf(Function);
  });

  describe('install event', () => {
    it('calls skipWaiting so the new worker activates immediately', () => {
      const { listeners, selfMock } = loadServiceWorker();

      listeners.install({});

      expect(selfMock.skipWaiting).toHaveBeenCalledTimes(1);
    });
  });

  describe('activate event', () => {
    it('deletes every cache except the current one', async () => {
      const { listeners, cachesMock } = loadServiceWorker();
      cachesMock.keys.mockResolvedValue([CACHE_NAME, 'gym-tracker-v0', 'other-cache']);
      const deleteMock = jest.fn().mockResolvedValue(true);
      cachesMock.delete = deleteMock;

      let waitUntilPromise;
      listeners.activate({ waitUntil: (p) => { waitUntilPromise = p; } });
      await waitUntilPromise;

      expect(deleteMock).toHaveBeenCalledWith('gym-tracker-v0');
      expect(deleteMock).toHaveBeenCalledWith('other-cache');
      expect(deleteMock).not.toHaveBeenCalledWith(CACHE_NAME);
      expect(deleteMock).toHaveBeenCalledTimes(2);
    });

    it('does not delete any caches when only the current cache exists', async () => {
      const { listeners, cachesMock } = loadServiceWorker();
      cachesMock.keys.mockResolvedValue([CACHE_NAME]);
      const deleteMock = jest.fn().mockResolvedValue(true);
      cachesMock.delete = deleteMock;

      let waitUntilPromise;
      listeners.activate({ waitUntil: (p) => { waitUntilPromise = p; } });
      await waitUntilPromise;

      expect(deleteMock).not.toHaveBeenCalled();
    });
  });

  describe('fetch event', () => {
    it('serves a cached response for /_next/ assets without calling fetch', async () => {
      const { listeners, cachesMock, fetchMock } = loadServiceWorker();
      const request = createRequest('https://example.com/_next/static/chunk.js');
      const cachedResponse = { cached: true };
      cachesMock.match.mockResolvedValue(cachedResponse);

      let respondWithPromise;
      listeners.fetch({ request, respondWith: (p) => { respondWithPromise = p; } });
      const result = await respondWithPromise;

      expect(cachesMock.match).toHaveBeenCalledWith(request);
      expect(fetchMock).not.toHaveBeenCalled();
      expect(result).toBe(cachedResponse);
    });

    it('fetches and caches uncached /static/ assets', async () => {
      const { listeners, cachesMock, fetchMock } = loadServiceWorker();
      const request = createRequest('https://example.com/static/logo.png');
      cachesMock.match.mockResolvedValue(undefined);
      const networkResponse = { ok: true, clone: jest.fn(() => 'cloned-response') };
      fetchMock.mockResolvedValue(networkResponse);
      const cachePut = jest.fn().mockResolvedValue(undefined);
      cachesMock.open.mockResolvedValue({ put: cachePut });

      let respondWithPromise;
      listeners.fetch({ request, respondWith: (p) => { respondWithPromise = p; } });
      const result = await respondWithPromise;
      await Promise.resolve();
      await Promise.resolve();

      expect(fetchMock).toHaveBeenCalledWith(request);
      expect(result).toBe(networkResponse);
      expect(cachesMock.open).toHaveBeenCalledWith(CACHE_NAME);
      expect(cachePut).toHaveBeenCalledWith(request, 'cloned-response');
    });

    it('does not intercept requests to /api/ routes', () => {
      const { listeners } = loadServiceWorker();
      const request = createRequest('https://example.com/api/workouts');
      const respondWith = jest.fn();

      listeners.fetch({ request, respondWith });

      expect(respondWith).not.toHaveBeenCalled();
    });

    it('does not intercept non-GET requests to app routes', () => {
      const { listeners } = loadServiceWorker();
      const request = createRequest('https://example.com/dashboard', 'POST');
      const respondWith = jest.fn();

      listeners.fetch({ request, respondWith });

      expect(respondWith).not.toHaveBeenCalled();
    });

    it('serves cached HTML pages for GET navigation requests when available', async () => {
      const { listeners, cachesMock, fetchMock } = loadServiceWorker();
      const request = createRequest('https://example.com/dashboard');
      const cachedResponse = { cached: true };
      cachesMock.match.mockResolvedValue(cachedResponse);

      let respondWithPromise;
      listeners.fetch({ request, respondWith: (p) => { respondWithPromise = p; } });
      const result = await respondWithPromise;

      expect(fetchMock).not.toHaveBeenCalled();
      expect(result).toBe(cachedResponse);
    });

    it('caches successful GET responses for app routes', async () => {
      const { listeners, cachesMock, fetchMock } = loadServiceWorker();
      const request = createRequest('https://example.com/dashboard');
      cachesMock.match.mockResolvedValue(undefined);
      const networkResponse = { ok: true, clone: jest.fn(() => 'cloned') };
      fetchMock.mockResolvedValue(networkResponse);
      const cachePut = jest.fn().mockResolvedValue(undefined);
      cachesMock.open.mockResolvedValue({ put: cachePut });

      let respondWithPromise;
      listeners.fetch({ request, respondWith: (p) => { respondWithPromise = p; } });
      const result = await respondWithPromise;
      await Promise.resolve();
      await Promise.resolve();

      expect(result).toBe(networkResponse);
      expect(cachesMock.open).toHaveBeenCalledWith(CACHE_NAME);
      expect(cachePut).toHaveBeenCalledWith(request, 'cloned');
    });

    it('does not cache a non-ok response for app routes', async () => {
      const { listeners, cachesMock, fetchMock } = loadServiceWorker();
      const request = createRequest('https://example.com/dashboard');
      cachesMock.match.mockResolvedValue(undefined);
      const networkResponse = { ok: false, clone: jest.fn(() => 'cloned') };
      fetchMock.mockResolvedValue(networkResponse);

      let respondWithPromise;
      listeners.fetch({ request, respondWith: (p) => { respondWithPromise = p; } });
      const result = await respondWithPromise;
      await Promise.resolve();
      await Promise.resolve();

      expect(result).toBe(networkResponse);
      expect(cachesMock.open).not.toHaveBeenCalled();
    });
  });
});