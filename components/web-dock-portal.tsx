import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Platform } from 'react-native';

const HOST_ID = 'app-dock-host';

/**
 * Render the icon dock as a sibling of `#root`, not inside the React Native
 * window. RN Web sizes that window to `visualViewport.height`, and ancestors
 * often create a containing block, so `position:fixed` mid-tree still hangs
 * over 01/02/03 on first paint. The host in `app/+html.tsx` is already pinned
 * to the visible viewport bottom (dock-correct-bottom.png).
 */
export function ensureWebDockHost(): HTMLElement | null {
  if (typeof document === 'undefined') {
    return null;
  }

  let host = document.getElementById(HOST_ID);
  if (!host) {
    host = document.createElement('div');
    host.id = HOST_ID;
    host.setAttribute('data-dock-edge', 'bottom');
    document.body.appendChild(host);
  }
  return host;
}

export function pinWebDockHost(host: HTMLElement | null = ensureWebDockHost()): void {
  if (!host) {
    return;
  }

  host.style.position = 'fixed';
  host.style.left = '0px';
  host.style.right = '0px';
  host.style.bottom = '0px';
  host.style.top = 'auto';
  host.style.zIndex = '20';
  host.style.pointerEvents = 'none';
}

export function WebDockPortal({ children }: { children: ReactNode }) {
  if (Platform.OS !== 'web') {
    return children;
  }

  const host = ensureWebDockHost();
  if (!host) {
    return children;
  }

  pinWebDockHost(host);
  return createPortal(children, host);
}
