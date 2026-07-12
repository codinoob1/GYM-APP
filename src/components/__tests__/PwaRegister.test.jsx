import { render } from '@testing-library/react';
import PwaRegister from '../PwaRegister';

describe('PwaRegister', () => {
  const originalServiceWorker = window.navigator.serviceWorker;

  afterEach(() => {
    if (originalServiceWorker === undefined) {
      delete window.navigator.serviceWorker;
    } else {
      Object.defineProperty(window.navigator, 'serviceWorker', {
        value: originalServiceWorker,
        configurable: true,
      });
    }
    jest.restoreAllMocks();
  });

  it('renders nothing to the DOM', () => {
    const { container } = render(<PwaRegister />);

    expect(container).toBeEmptyDOMElement();
  });

  it('does not throw when the browser has no serviceWorker support', () => {
    delete window.navigator.serviceWorker;

    expect(() => render(<PwaRegister />)).not.toThrow();
  });

  it('registers /sw.js when serviceWorker is supported', () => {
    const register = jest.fn().mockResolvedValue({});
    Object.defineProperty(window.navigator, 'serviceWorker', {
      value: { register },
      configurable: true,
    });

    render(<PwaRegister />);

    expect(register).toHaveBeenCalledTimes(1);
    expect(register).toHaveBeenCalledWith('/sw.js');
  });

  it('only registers once when re-rendered with the same props', () => {
    const register = jest.fn().mockResolvedValue({});
    Object.defineProperty(window.navigator, 'serviceWorker', {
      value: { register },
      configurable: true,
    });

    const { rerender } = render(<PwaRegister />);
    rerender(<PwaRegister />);

    expect(register).toHaveBeenCalledTimes(1);
  });
});