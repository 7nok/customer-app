import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Web-only root HTML for static export and `expo start --web`.
 * Runs in Node during export — no browser APIs here (the viewport script
 * is emitted as a string and runs in the browser).
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta
          name="description"
          content="Daily Drivin — mobile auto care around Hillsboro, Texas. Request a visit, check maintenance intervals, and join the rewards list."
        />
        <title>Daily Drivin · Hillsboro, TX</title>
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveCss }} />
      </head>
      <body>
        {children}
        <div id="app-dock-host" data-dock-edge="bottom" />
        <script dangerouslySetInnerHTML={{ __html: visualViewportLockScript }} />
      </body>
    </html>
  );
}

/**
 * First paint: #root stretches to the layout bottom. `#app-dock-host` is a
 * sibling of `#root`, pinned to the visible viewport bottom so the icon dock
 * matches dock-correct-bottom.png immediately — content may sit under it.
 *
 * Script is after `#root` so the first measure can style the shell before
 * paint. Keep in sync with `hooks/use-lock-to-visual-viewport.ts`.
 */
const visualViewportLockScript = `(function(){
  if (window.__lockAppToVisualViewport) return;
  function box() {
    var inner = window.innerHeight || 0;
    var vv = window.visualViewport;
    var scale = vv && vv.scale ? vv.scale : 1;
    var top = 0;
    var height = inner;
    var pinToBottom = true;
    if (vv && scale === 1 && vv.height > 0) {
      top = vv.offsetTop || 0;
      height = vv.height;
      var bottomGap = inner - top - height;
      if (top === 0 && inner > height + 1) {
        top = inner - height;
        pinToBottom = true;
      } else if (top > 0 && bottomGap <= 1) {
        pinToBottom = false;
      } else {
        pinToBottom = true;
      }
    }
    if (top < 0) top = 0;
    if (inner > 0 && top + height > inner) height = Math.max(0, inner - top);
    if (height <= 0 && inner > 0) height = inner - top;
    return { top: top, height: height, pinToBottom: pinToBottom };
  }
  function pinDockHost() {
    var host = document.getElementById('app-dock-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'app-dock-host';
      host.setAttribute('data-dock-edge', 'bottom');
      document.body.appendChild(host);
    }
    host.style.position = 'fixed';
    host.style.left = '0px';
    host.style.right = '0px';
    host.style.bottom = '0px';
    host.style.top = 'auto';
    host.style.zIndex = '20';
    host.style.pointerEvents = 'none';
    var dock = document.getElementById('app-tab-bar');
    if (dock && dock.parentNode !== host) {
      host.appendChild(dock);
    }
    if (dock) {
      dock.style.pointerEvents = 'auto';
      dock.style.width = '100%';
    }
  }
  function measure() {
    var next = box();
    var t = Math.round(next.top) + 'px';
    var h = Math.round(next.height > 0 ? next.height : (window.innerHeight || 0)) + 'px';
    document.documentElement.style.setProperty('--app-top', t);
    document.documentElement.style.setProperty('--app-height', h);
    var root = document.getElementById('root');
    if (root) {
      root.style.position = 'fixed';
      root.style.top = t;
      if (next.pinToBottom) {
        root.style.bottom = '0px';
        root.style.height = 'auto';
        root.style.maxHeight = 'none';
      } else {
        root.style.bottom = 'auto';
        root.style.height = h;
        root.style.maxHeight = h;
      }
    }
    pinDockHost();
  }
  window.__lockAppToVisualViewport = measure;
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('orientationchange', measure);
  window.addEventListener('pageshow', measure);
  window.addEventListener('load', measure);
  document.addEventListener('visibilitychange', measure);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', measure);
    window.visualViewport.addEventListener('scroll', measure);
  }
  if (window.MutationObserver) {
    new MutationObserver(measure).observe(document.body, { childList: true, subtree: true });
  }
  var frames = 0;
  function poll() {
    measure();
    frames += 1;
    if (frames < 180) requestAnimationFrame(poll);
  }
  requestAnimationFrame(poll);
})();`;

const responsiveCss = `
  *, *::before, *::after { box-sizing: border-box; }
  :root {
    --app-top: env(safe-area-inset-top, 0px);
    --app-height: 100%;
  }
  html, body {
    height: 100%;
    margin: 0;
    max-width: 100%;
    overflow: hidden;
    overscroll-behavior: none;
    background: #000000;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }
  body {
    min-width: 320px;
  }
  #root {
    position: fixed !important;
    top: var(--app-top, 0px) !important;
    bottom: 0 !important;
    left: 0;
    right: 0;
    display: flex !important;
    flex-direction: column !important;
    width: 100%;
    max-width: 100%;
    height: auto !important;
    max-height: none !important;
    min-height: 0;
    margin: 0 auto;
    overflow: hidden;
    background: #000000;
  }
  #root > * {
    flex: 1 1 0% !important;
    min-height: 0 !important;
    width: 100% !important;
    max-height: none !important;
  }
  @media (min-width: 600px) {
    #root {
      max-width: none;
    }
  }
  /* Host lives outside #root so first paint matches dock-correct-bottom.png:
     pinned to the visible viewport bottom, just above in-app chrome. RN Web
     ancestors cannot trap this in a short visualViewport containing block. */
  #app-dock-host {
    position: fixed !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    top: auto !important;
    z-index: 20;
    width: 100%;
    pointer-events: none;
  }
  #app-tab-bar {
    position: relative !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    top: auto !important;
    z-index: 20;
    flex: 0 0 auto !important;
    flex-grow: 0 !important;
    flex-shrink: 0 !important;
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
    background: #000000;
    padding-bottom: 0 !important;
    pointer-events: auto;
    width: 100%;
  }
  #app-tab-bar [role="tablist"] {
    overflow: visible !important;
  }
  input, textarea, select, button {
    font-size: 16px;
  }
`;
