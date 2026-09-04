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
        <meta name="theme-color" content="#F7F7F4" />
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
 * First paint: #root stretches from the top safe area to the layout bottom
 * (no 100vh / 100svh). JS then pins the visible box.
 *
 * If visualViewport is shorter than innerHeight and offsetTop is 0 (common in
 * in-app WKWebViews), leftover space is applied as a *top* inset and #root
 * stretches to bottom:0 so body navy cannot form a slab under the tabs.
 *
 * Keep in sync with `hooks/use-lock-to-visual-viewport.ts`.
 */
const visualViewportLockScript = `(function(){
  if (window.__lockAppToVisualViewport) return;
  function measure() {
    var inner = window.innerHeight || 0;
    var vv = window.visualViewport;
    var scale = vv && vv.scale ? vv.scale : 1;
    var top = 0;
    var height = inner;
    if (vv && scale === 1 && vv.height > 0) {
      top = vv.offsetTop || 0;
      height = vv.height;
      if (top === 0 && inner > height + 1) {
        top = inner - height;
      }
    }
    if (top < 0) top = 0;
    if (inner > 0 && top + height > inner) height = Math.max(0, inner - top);
    var t = Math.round(top) + 'px';
    var h = Math.round(height > 0 ? height : inner) + 'px';
    var pinToBottom = !(vv && (vv.offsetTop || 0) > 0);
    document.documentElement.style.setProperty('--app-top', t);
    document.documentElement.style.setProperty('--app-height', h);
    var root = document.getElementById('root');
    if (root) {
      root.style.position = 'fixed';
      root.style.top = t;
      if (pinToBottom) {
        root.style.bottom = '0px';
        root.style.height = 'auto';
        root.style.maxHeight = 'none';
      } else {
        root.style.bottom = 'auto';
        root.style.height = h;
        root.style.maxHeight = h;
      }
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
    --app-top: env(safe-area-inset-top, 0px);
    --app-height: 100%;
  }
  html, body {
    height: 100%;
    margin: 0;
    max-width: 100%;
    overflow: hidden;
    overscroll-behavior: none;
    background: #F7F7F4;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }
  body {
    min-width: 320px;
  }
  #root {
    position: fixed;
    top: var(--app-top, 0px);
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    height: auto;
    min-height: 0;
    margin: 0 auto;
    overflow: hidden;
    background: #F7F7F4;
  }
  #root > * {
    flex: 1 1 auto;
    min-height: 0;
  }
  @media (min-width: 600px) {
    #root {
      max-width: 440px;
      box-shadow: none;
    }
  }
  /* Top text nav: intrinsic height only. */
  #app-tab-bar {
    flex: 0 0 auto !important;
    flex-grow: 0 !important;
    flex-shrink: 0 !important;
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
    background: #F7F7F4;
    padding-bottom: 0 !important;
  }
  #app-tab-bar [role="tablist"] {
    overflow: visible !important;
  }
  input, textarea, select, button {
    font-size: 16px;
  }
`;
