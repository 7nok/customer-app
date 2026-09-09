import { useLayoutEffect } from 'react';
import { Platform } from 'react-native';

import { computeVisibleShellBox } from '@/lib/visible-shell';

declare global {
  interface Window {
    __lockAppToVisualViewport?: () => void;
  }
}

/**
 * Pin `#root` to the visible box and keep the dock on the layout bottom
 * when in-app WKWebViews report a short visualViewport with offsetTop 0.
 *
 * Keep in sync with the blocking script in `app/+html.tsx`.
 */
export function measureVisibleViewport(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const box = visibleShellBox();
  const topPx = `${Math.round(box.top)}px`;
  const heightPx = `${Math.round(box.height)}px`;

  document.documentElement.style.setProperty('--app-top', topPx);
  document.documentElement.style.setProperty('--app-height', heightPx);

  const root = document.getElementById('root');
  if (root) {
    root.style.position = 'fixed';
    root.style.top = topPx;
    if (box.pinToBottom) {
      root.style.bottom = '0px';
      root.style.height = 'auto';
      root.style.maxHeight = 'none';
    } else {
      root.style.bottom = 'auto';
      root.style.height = heightPx;
      root.style.maxHeight = heightPx;
    }
  }

  window.__lockAppToVisualViewport = measureVisibleViewport;
}

export function visibleShellBox(): { top: number; height: number; pinToBottom: boolean } {
  const vv = window.visualViewport;
  return computeVisibleShellBox({
    innerHeight: window.innerHeight || 0,
    visualViewport: vv
      ? { height: vv.height, offsetTop: vv.offsetTop || 0, scale: vv.scale ?? 1 }
      : null,
  });
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
    window.addEventListener('load', onSync);
    document.addEventListener('visibilitychange', onSync);
    vv?.addEventListener('resize', onSync);
    vv?.addEventListener('scroll', onSync);

    const root = document.getElementById('root');
    const observer =
      typeof MutationObserver === 'undefined'
        ? null
        : new MutationObserver(() => measureVisibleViewport());
    observer?.observe(root ?? document.body, { childList: true, subtree: true });

    let frames = 0;
    let raf = requestAnimationFrame(function poll() {
      measureVisibleViewport();
      frames += 1;
      if (frames < 180) {
        raf = requestAnimationFrame(poll);
      }
    });

    return () => {
      window.removeEventListener('resize', onSync);
      window.removeEventListener('orientationchange', onSync);
      window.removeEventListener('pageshow', onSync);
      window.removeEventListener('load', onSync);
      document.removeEventListener('visibilitychange', onSync);
      vv?.removeEventListener('resize', onSync);
      vv?.removeEventListener('scroll', onSync);
      observer?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);
}
