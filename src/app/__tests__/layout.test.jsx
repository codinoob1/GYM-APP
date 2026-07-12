import { renderToStaticMarkup } from 'react-dom/server';
import RootLayout, { metadata } from '../layout';

jest.mock('@/components/PwaRegister', () => {
  return function MockPwaRegister() {
    return <div data-testid="pwa-register-mock" />;
  };
});

describe('app metadata', () => {
  it('registers the PWA manifest', () => {
    expect(metadata.manifest).toBe('/manifest.json');
  });

  it('sets the apple touch icon to the rounded icon', () => {
    expect(metadata.icons).toEqual({ apple: '/icon512_rounded.png' });
  });

  it('keeps the existing title and description', () => {
    expect(metadata.title).toBe(
      'Gym Tracker AI - Workout Plans with Progressive Overload'
    );
    expect(metadata.description).toBe(
      'AI-powered workout tracking. Paste your plan, get automatic progressive overload, track strength gains.'
    );
  });
});

describe('RootLayout', () => {
  it('renders an html document with lang="en"', () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <main>child content</main>
      </RootLayout>
    );

    expect(html).toContain('lang="en"');
  });

  it('mounts the PwaRegister component inside the body', () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <main>child content</main>
      </RootLayout>
    );

    expect(html).toContain('data-testid="pwa-register-mock"');
  });

  it('renders PwaRegister before the page children', () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <main>child content</main>
      </RootLayout>
    );

    const pwaIndex = html.indexOf('data-testid="pwa-register-mock"');
    const childIndex = html.indexOf('child content');

    expect(pwaIndex).toBeGreaterThan(-1);
    expect(childIndex).toBeGreaterThan(-1);
    expect(pwaIndex).toBeLessThan(childIndex);
  });

  it('still renders the provided children', () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <span data-testid="unique-child">unique marker</span>
      </RootLayout>
    );

    expect(html).toContain('unique marker');
  });
});