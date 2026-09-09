import assert from 'node:assert/strict';
import { test } from 'node:test';

import { injectSwitcherMarkup } from './inject-switcher.mjs';

const sample = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Daily Drivin</title>
  </head>
  <body>
    <div id="root"></div>
    <div id="app-dock-host"></div>
  </body>
</html>
`;

test('injects stylesheet, ?v= redirect, and switcher script once', () => {
  const once = injectSwitcherMarkup(sample);
  assert.match(once, /preview-switcher\.css/);
  assert.match(once, /data-preview-switcher="redirect"/);
  assert.match(once, /preview-switcher\.js/);
  assert.ok(once.indexOf('preview-switcher.css') < once.toLowerCase().indexOf('</head>'));
  assert.ok(once.indexOf('preview-switcher.js') < once.toLowerCase().indexOf('</body>'));

  const twice = injectSwitcherMarkup(once);
  assert.equal(twice, once);
});
