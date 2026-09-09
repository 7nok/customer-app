import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  chooseVariant,
  normalizePathname,
  normalizeVariant,
  queryVariant,
  resolveLocation,
  restAfterVariant,
  stripVariantParam,
  urlForVariant,
  variantFromPath,
} from './preview-routes.mjs';

test('normalizeVariant accepts only a/b/c', () => {
  assert.equal(normalizeVariant('A'), 'a');
  assert.equal(normalizeVariant(' b '), 'b');
  assert.equal(normalizeVariant('d'), null);
  assert.equal(normalizeVariant(''), null);
});

test('queryVariant reads v= and ignores junk', () => {
  assert.equal(queryVariant('?v=c'), 'c');
  assert.equal(queryVariant('?foo=1&v=B'), 'b');
  assert.equal(queryVariant('?v=nope'), null);
  assert.equal(queryVariant(''), null);
});

test('stripVariantParam leaves other query keys', () => {
  assert.equal(stripVariantParam('?v=a'), '');
  assert.equal(stripVariantParam('?v=b&tab=book'), '?tab=book');
});

test('variantFromPath reads /customer-app/{a|b|c}', () => {
  assert.equal(variantFromPath('/customer-app/a/'), 'a');
  assert.equal(variantFromPath('/customer-app/b/book'), 'b');
  assert.equal(variantFromPath('/customer-app/c/index.html'), 'c');
  assert.equal(variantFromPath('/customer-app/'), null);
  assert.equal(variantFromPath('/customer-app/book'), null);
  assert.equal(variantFromPath('/customer-app/about'), null);
});

test('normalizePathname treats index.html as the directory', () => {
  assert.equal(normalizePathname('/customer-app/index.html'), '/customer-app/');
  assert.equal(normalizePathname('/customer-app/a/index.html'), '/customer-app/a/');
});

test('restAfterVariant keeps in-app routes and maps legacy root routes', () => {
  assert.equal(restAfterVariant('/customer-app/a/'), '/');
  assert.equal(restAfterVariant('/customer-app/a/book'), '/book');
  assert.equal(restAfterVariant('/customer-app/b/maintenance/items'), '/maintenance/items');
  assert.equal(restAfterVariant('/customer-app/'), '/');
  assert.equal(restAfterVariant('/customer-app/book'), '/book');
  assert.equal(restAfterVariant('/customer-app/availability'), '/availability');
});

test('urlForVariant preserves the in-app path when flipping designs', () => {
  assert.equal(urlForVariant('/customer-app/a/book', '', '', 'c'), '/customer-app/c/book');
  assert.equal(urlForVariant('/customer-app/b/', '?v=b', '', 'a'), '/customer-app/a/');
  assert.equal(
    urlForVariant('/customer-app/a/loyalty', '?v=c&x=1', '#top', 'c'),
    '/customer-app/c/loyalty?x=1#top',
  );
});

test('chooseVariant prefers ?v= over localStorage over default A', () => {
  assert.equal(chooseVariant('b', 'c'), 'b');
  assert.equal(chooseVariant(null, 'c'), 'c');
  assert.equal(chooseVariant(null, null), 'a');
});

test('resolveLocation: root splash goes to last chosen or A', () => {
  const fresh = resolveLocation({
    pathname: '/customer-app/',
    search: '',
    hash: '',
    stored: null,
  });
  assert.equal(fresh.variant, 'a');
  assert.equal(fresh.href, '/customer-app/a/');
  assert.equal(fresh.persist, 'a');

  const remembered = resolveLocation({
    pathname: '/customer-app/',
    search: '',
    hash: '',
    stored: 'b',
  });
  assert.equal(remembered.variant, 'b');
  assert.equal(remembered.href, '/customer-app/b/');
});

test('resolveLocation: ?v= on the root wins and is remembered', () => {
  const next = resolveLocation({
    pathname: '/customer-app/',
    search: '?v=c',
    hash: '',
    stored: 'a',
  });
  assert.equal(next.variant, 'c');
  assert.equal(next.href, '/customer-app/c/');
  assert.equal(next.persist, 'c');
});

test('resolveLocation: ?v= on a variant page switches without losing the route', () => {
  const next = resolveLocation({
    pathname: '/customer-app/a/book',
    search: '?v=b',
    hash: '',
    stored: 'a',
  });
  assert.equal(next.variant, 'b');
  assert.equal(next.href, '/customer-app/b/book');
  assert.equal(next.persist, 'b');
});

test('resolveLocation: already on the requested variant does not bounce', () => {
  const stay = resolveLocation({
    pathname: '/customer-app/c/about',
    search: '',
    hash: '',
    stored: 'a',
  });
  assert.equal(stay.variant, 'c');
  assert.equal(stay.href, null);
  assert.equal(stay.persist, 'c');
});

test('resolveLocation: legacy A URLs without /a/ remap into the chosen variant', () => {
  const book = resolveLocation({
    pathname: '/customer-app/book',
    search: '',
    hash: '',
    stored: 'c',
  });
  assert.equal(book.href, '/customer-app/c/book');
  assert.equal(book.variant, 'c');
});
