/**
 * Shared routing for the A/B/C Pages preview switcher.
 * Used by tests and kept in lockstep with preview/preview-switcher.js.
 */
export const PAGES_PREFIX = '/customer-app';
export const STORAGE_KEY = 'customer-app-variant';
export const VARIANTS = ['a', 'b', 'c'];
export const DEFAULT_VARIANT = 'a';

export function normalizeVariant(value) {
  if (typeof value !== 'string') {
    return null;
  }
  const variant = value.trim().toLowerCase();
  return VARIANTS.includes(variant) ? variant : null;
}

export function queryVariant(search) {
  const raw = typeof search === 'string' && search.startsWith('?') ? search.slice(1) : search || '';
  const params = new URLSearchParams(raw);
  return normalizeVariant(params.get('v'));
}

export function stripVariantParam(search) {
  if (!search || search === '?') {
    return '';
  }
  const raw = search.startsWith('?') ? search.slice(1) : search;
  const params = new URLSearchParams(raw);
  params.delete('v');
  const next = params.toString();
  return next ? `?${next}` : '';
}

export function normalizePathname(pathname) {
  if (!pathname) {
    return `${PAGES_PREFIX}/`;
  }
  if (pathname === PAGES_PREFIX || pathname === `${PAGES_PREFIX}/index.html`) {
    return `${PAGES_PREFIX}/`;
  }
  if (pathname.endsWith('/index.html') && pathname.startsWith(`${PAGES_PREFIX}/`)) {
    return pathname.slice(0, -'index.html'.length);
  }
  return pathname;
}

export function variantFromPath(pathname) {
  const path = normalizePathname(pathname);
  const match = path.match(/^\/customer-app\/([abc])(?=\/|$)/);
  return match ? match[1] : null;
}

export function restAfterVariant(pathname) {
  const path = normalizePathname(pathname);
  const variant = variantFromPath(path);
  if (!variant) {
    if (path === `${PAGES_PREFIX}/`) {
      return '/';
    }
    if (path.startsWith(`${PAGES_PREFIX}/`)) {
      return path.slice(PAGES_PREFIX.length) || '/';
    }
    return path.startsWith('/') ? path : `/${path}`;
  }
  const prefix = `${PAGES_PREFIX}/${variant}`;
  const rest = path.slice(prefix.length);
  if (!rest || rest === '/') {
    return '/';
  }
  return rest.startsWith('/') ? rest : `/${rest}`;
}

export function urlForVariant(pathname, search, hash, variant) {
  const rest = restAfterVariant(pathname);
  const path = rest === '/' ? `${PAGES_PREFIX}/${variant}/` : `${PAGES_PREFIX}/${variant}${rest}`;
  return `${path}${stripVariantParam(search)}${hash || ''}`;
}

export function chooseVariant(queryV, stored, fallback = DEFAULT_VARIANT) {
  return normalizeVariant(queryV) || normalizeVariant(stored) || fallback;
}

/**
 * Decide whether to stay or rewrite the URL.
 * `persist` is the variant to remember when a choice is explicit or implied.
 */
export function resolveLocation({ pathname, search, hash, stored }) {
  const path = normalizePathname(pathname);
  const query = queryVariant(search);
  const pathVariant = variantFromPath(path);
  const chosen = chooseVariant(query, stored);

  if (pathVariant) {
    const variant = query || pathVariant;
    const href = urlForVariant(path, search, hash, variant);
    const current = `${path}${search || ''}${hash || ''}`;
    return {
      variant,
      href: href === current ? null : href,
      persist: variant,
    };
  }

  const href = urlForVariant(path, search, hash, chosen);
  return {
    variant: chosen,
    href,
    persist: chosen,
  };
}
