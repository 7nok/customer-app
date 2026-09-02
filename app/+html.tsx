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
        <meta name="theme-color" content="#0B1622" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta
          name="description"
          content="Joe’s mechanic shop in Hillsboro, Texas — book a visit, check maintenance intervals, and join the shop list."
        />
        <title>Joe’s · Hillsboro, TX</title>
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveCss }} />
        <script dangerouslySetInnerHTML={{ __html: visualViewportLockScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

/**
 * html/body fill the layout viewport (100%). #root is pinned to
 * visualViewport.height + offsetTop. Never 100vh / 100svh on the shell — those
 * units undersize this in-app webview without a matching offsetTop, which
 * clips the hero and leaves a navy hole under the tab bar.
 *
 * Keep the script in sync with `hooks/use-lock-to-visual-viewport.ts`.
 */
const visualViewportLockScript = `(function(){
  if (window.__lockAppToVisualViewport) return;
  function measure() {
    var vv = window.visualViewport;
    var scale = vv && vv.scale ? vv.scale : 1;
    var top = 0;
    var height = window.innerHeight || 0;
    if (vv && scale === 1 && vv.height > 0) {
      top = vv.offsetTop || 0;
      height = vv.height;
    }
    if (height <= 0) return;
    var h = Math.round(height) + 'px';
    var t = Math.round(top) + 'px';
    document.documentElement.style.setProperty('--app-height', h);
    document.documentElement.style.setProperty('--app-top', t);
    var root = document.getElementById('root');
    if (root) {
      root.style.position = 'fixed';
      root.style.top = t;
      root.style.height = h;
      root.style.maxHeight = h;
    }
  }
  window.__lockAppToVisualViewport = measure;
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('orientationchange', measure);
  window.addEventListener('pageshow', measure);
  document.addEventListener('visibilitychange', measure);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', measure);
    window.visualViewport.addEventListener('scroll', measure);
  }
  var frames = 0;
  function poll() {
    measure();
    frames += 1;
    if (frames < 60) requestAnimationFrame(poll);
  }
  requestAnimationFrame(poll);
})();`;

const responsiveCss = `
  *, *::before, *::after { box-sizing: border-box; }
  :root {
    --app-height: 100%;
    --app-top: 0px;
  }
  html, body {
    height: 100%;
    margin: 0;
    max-width: 100%;
    overflow: hidden;
    overscroll-behavior: none;
    background: #0B1622;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }
  body {
    min-width: 320px;
  }
  #root {
    position: fixed;
    top: var(--app-top, 0px);
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    height: var(--app-height, 100%);
    min-height: 0;
    margin: 0 auto;
    overflow: hidden;
    background: #F3EFE6;
  }
  #root > * {
    flex: 1 1 auto;
    min-height: 0;
  }
  @media (min-width: 600px) {
    #root {
      max-width: 560px;
      box-shadow: 0 0 0 1px #142433, 0 18px 48px rgba(0, 0, 0, 0.28);
    }
  }
  /* Compact tab bar: intrinsic height only. Cap safe-area so a broken
     env(safe-area-inset-bottom) cannot stretch a navy slab. */
  #app-tab-bar {
    flex: 0 0 auto !important;
    flex-grow: 0 !important;
    flex-shrink: 0 !important;
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
    background: #0B1622;
    padding-bottom: min(34px, env(safe-area-inset-bottom, 0px));
  }
  #app-tab-bar [role="tablist"] {
    overflow: visible !important;
  }
  input, textarea, select, button {
    font-size: 16px;
  }
`;
