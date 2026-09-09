import assert from 'node:assert/strict';
import { test } from 'node:test';

import { computeVisibleShellBox } from './visible-shell.ts';

test('Grok first-load / settled: leftover is a top inset, pin dock to layout bottom', () => {
  const box = computeVisibleShellBox({
    innerHeight: 844,
    visualViewport: { height: 650, offsetTop: 0, scale: 1 },
  });
  assert.equal(box.top, 194);
  assert.equal(box.height, 650);
  assert.equal(box.pinToBottom, true);
});

test('Safari URL bar: real offsetTop and no bottom gap keeps the visual band', () => {
  const box = computeVisibleShellBox({
    innerHeight: 844,
    visualViewport: { height: 750, offsetTop: 94, scale: 1 },
  });
  assert.equal(box.top, 94);
  assert.equal(box.height, 750);
  assert.equal(box.pinToBottom, false);
});

test('missing visualViewport fills the layout viewport', () => {
  const box = computeVisibleShellBox({ innerHeight: 800, visualViewport: null });
  assert.equal(box.top, 0);
  assert.equal(box.height, 800);
  assert.equal(box.pinToBottom, true);
});
