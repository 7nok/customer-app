import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Web-only root HTML for static export and `expo start --web`.
 * Runs in Node during export — no browser APIs here.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#0B1622" />
        <meta
          name="description"
          content="Joe’s mechanic shop in Hillsboro, Texas — book a visit, check maintenance intervals, and join the shop list."
        />
        <title>Joe’s · Hillsboro, TX</title>
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: responsiveCss }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveCss = `
  *, *::before, *::after { box-sizing: border-box; }
  html, body {
    height: 100%;
    margin: 0;
    max-width: 100%;
    overflow-x: hidden;
    background: #0B1622;
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }
  body {
    min-width: 320px;
  }
  #root {
    min-height: 100%;
    max-width: 100%;
    margin: 0 auto;
    overflow-x: hidden;
    background: #F3EFE6;
  }
  @media (min-width: 600px) {
    #root {
      max-width: 560px;
      min-height: 100%;
      box-shadow: 0 0 0 1px #142433, 0 18px 48px rgba(0, 0, 0, 0.28);
    }
  }
  input, textarea, select, button {
    font-size: 16px;
  }
`;
