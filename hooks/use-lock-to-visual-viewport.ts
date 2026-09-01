import { useLayoutEffect } from 'react';
import { Platform } from 'react-native';

declare global {
  interface Window {
    __lockAppToVisualViewport?: () => void;
  }
}

const HEIGHT_VAR = '--app-height';
const TOP_VAR = '--app-top';

/**
 * Size the web app shell to the *visible* viewport, not 100vh / the layout
 * viewport. In-app browsers (and iOS Safari) overlay chrome on top of the
 * layout viewport; locking to visualViewport (and innerHeight as a floor)
 * keeps the hero and tab bar on-screen on first paint and when chrome moves.
 *
 * Keep this in sync with the blocking script in `app/+html.tsx`.
 */
export function measureVisibleViewport(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const vv = window.visualViewport;
  const heights: number[] = [];
  const scale = vv?.scale ?? 1;
  if (vv && vv.height && scale === 1) {
    heights.push(vv.height);
  }
  if (window.innerHeight) {
    heights.push(window.innerHeight);
  }
  const clientHeight = document.documentElement?.clientHeight;
  if (clientHeight) {
    heights.push(clientHeight);
  }

  const height = heights.length ? Math.min(...heights) : 0;
  const top = scale === 1 ? (vv?.offsetTop ?? 0) : 0;
  const root = document.documentElement;
  if (height > 0) {
    root.style.setProperty(HEIGHT_VAR, `${Math.round(height)}px`);
    root.style.setProperty(TOP_VAR, `${Math.round(top)}px`);
  }
}

export function useLockToVisualViewport(): void {
  useLayoutEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    measureVisibleViewport();

    const vv = window.visualViewport;
    const onSync = () => measureVisibleViewport();
    window.addEventListener('resize', onSync);
    window.addEventListener('orientationchange', onSync);
    window.addEventListener('pageshow', onSync);
    document.addEventListener('visibilitychange', onSync);
    vv?.addEventListener('resize', onSync);
    vv?.addEventListener('scroll', onSync);

    let frames = 0;
    let raf = requestAnimationFrame(function poll() {
      measureVisibleViewport();
      frames += 1;
      if (frames < 60) {
        raf = requestAnimationFrame(poll);
      }
    });

    return () => {
      window.removeEventListener('resize', onSync);
      window.removeEventListener('orientationchange', onSync);
      window.removeEventListener('pageshow', onSync);
      document.removeEventListener('visibilitychange', onSync);
      vv?.removeEventListener('resize', onSync);
      vv?.removeEventListener('scroll', onSync);
      cancelAnimationFrame(raf);
    };
  }, []);
}
