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
 * First-paint shell: never 100vh. 100svh is the viewport with browser chrome
 * showing (the first-open state). JS then writes --app-height from
 * visualViewport / innerHeight so in-app webviews that overlay a toolbar still
 * fit without a scroll-jiggle.
 *
 * Keep the script in sync with `hooks/use-lock-to-visual-viewport.ts`.
 */
const visualViewportLockScript = `(function(){
  if (window.__lockAppToVisualViewport) return;
  var HEIGHT_VAR = '--app-height';
  var TOP_VAR = '--app-top';
  function measure() {
    var vv = window.visualViewport;
    var heights = [];
    var scale = vv && vv.scale ? vv.scale : 1;
    if (vv && vv.height && scale === 1) heights.push(vv.height);
    if (window.innerHeight) heights.push(window.innerHeight);
    var ch = document.documentElement && document.documentElement.clientHeight;
    if (ch) heights.push(ch);
    if (!heights.length) return;
    var height = Math.min.apply(Math, heights);
    var top = scale === 1 && vv && vv.offsetTop ? vv.offsetTop : 0;
    document.documentElement.style.setProperty(HEIGHT_VAR, Math.round(height) + 'px');
    document.documentElement.style.setProperty(TOP_VAR, Math.round(top) + 'px');
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
  @supports (height: 100svh) {
    :root { --app-height: 100svh; }
  }
  html, body {
    height: var(--app-height, 100%);
    max-height: var(--app-height, 100%);
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
    max-height: var(--app-height, 100%);
    min-height: 0;
    margin: 0 auto;
    overflow: hidden;
    background: #F3EFE6;
  }
  #root > * {
    flex: 1;
    min-height: 0;
    max-height: 100%;
  }
  @media (min-width: 600px) {
    #root {
      max-width: 560px;
      box-shadow: 0 0 0 1px #142433, 0 18px 48px rgba(0, 0, 0, 0.28);
    }
  }
  /* Tab bar: home indicator + in-app browser toolbars that ignore safe-area. */
  #app-tab-bar {
    flex: 0 0 auto;
    background: #0B1622;
    padding-bottom: env(safe-area-inset-bottom, 0px) !important;
  }
  @media (max-width: 480px) {
    #app-tab-bar {
      padding-bottom: max(16px, env(safe-area-inset-bottom, 0px)) !important;
    }
  }
  input, textarea, select, button {
    font-size: 16px;
  }
`;
