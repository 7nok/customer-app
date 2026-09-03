import { useLayoutEffect } from 'react';
import { Platform } from 'react-native';

declare global {
  interface Window {
    __lockAppToVisualViewport?: () => void;
  }
}

/**
 * Pin `#root` to the visible box.
 *
 * Grok's in-app browser reports visualViewport.height shorter than innerHeight
 * but offsetTop === 0. Using that height at top:0 leaves a navy hole under the
 * tabs (body shows through) while the URL bar still covers the hero.
 *
 * When offsetTop is 0 and the visual viewport is shorter, treat the leftover
 * as a *top* inset and stretch `#root` to the layout bottom so the tab bar
 * sits flush above the in-app toolbar.
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
}

export function visibleShellBox(): { top: number; height: number; pinToBottom: boolean } {
  const inner = window.innerHeight || 0;
  const vv = window.visualViewport;
  const scale = vv?.scale ?? 1;
  let top = 0;
  let height = inner;
  let pinToBottom = true;

  if (vv && scale === 1 && vv.height > 0) {
    top = vv.offsetTop || 0;
    height = vv.height;
    if (top === 0 && inner > height + 1) {
      top = inner - height;
      pinToBottom = true;
    } else if (top > 0) {
      pinToBottom = false;
    }
  }

  if (top < 0) {
    top = 0;
  }
  if (inner > 0 && top + height > inner) {
    height = Math.max(0, inner - top);
  }
  if (height <= 0 && inner > 0) {
    height = inner - top;
  }

  return { top, height, pinToBottom };
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
