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
 * Pin the web shell to the visual viewport box (height + offsetTop).
 *
 * Do not mix in `documentElement.clientHeight` or 100svh: those follow our own
 * CSS and shrink the shell without moving it down, which leaves a navy gap
 * below the tab bar while the in-app URL bar still covers the hero.
 *
 * Keep this in sync with the blocking script in `app/+html.tsx`.
 */
export function measureVisibleViewport(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const vv = window.visualViewport;
  const scale = vv?.scale ?? 1;
  let top = 0;
  let height = window.innerHeight || 0;

  if (vv && scale === 1 && vv.height > 0) {
    top = vv.offsetTop || 0;
    height = vv.height;
  }

  if (height <= 0) {
    return;
  }

  const heightPx = `${Math.round(height)}px`;
  const topPx = `${Math.round(top)}px`;
  document.documentElement.style.setProperty(HEIGHT_VAR, heightPx);
  document.documentElement.style.setProperty(TOP_VAR, topPx);

  const root = document.getElementById('root');
  if (root) {
    root.style.position = 'fixed';
    root.style.top = topPx;
    root.style.height = heightPx;
    root.style.maxHeight = heightPx;
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
