/**
 * Persistent A/B/C design switcher for the GitHub Pages preview.
 * Vanilla JS so it can be injected into each exported variant without
 * touching Expo navigation. Keep routing rules aligned with
 * scripts/preview-routes.mjs.
 */
(function () {
  var PAGES_PREFIX = '/customer-app';
  var STORAGE_KEY = 'customer-app-variant';
  var VARIANTS = ['a', 'b', 'c'];
  var DEFAULT_VARIANT = 'a';

  function normalizeVariant(value) {
    if (typeof value !== 'string') {
      return null;
    }
    var variant = value.trim().toLowerCase();
    return VARIANTS.indexOf(variant) !== -1 ? variant : null;
  }

  function queryVariant(search) {
    var raw = typeof search === 'string' && search.charAt(0) === '?' ? search.slice(1) : search || '';
    try {
      return normalizeVariant(new URLSearchParams(raw).get('v'));
    } catch (error) {
      return null;
    }
  }

  function stripVariantParam(search) {
    if (!search || search === '?') {
      return '';
    }
    var raw = search.charAt(0) === '?' ? search.slice(1) : search;
    var params = new URLSearchParams(raw);
    params.delete('v');
    var next = params.toString();
    return next ? '?' + next : '';
  }

  function normalizePathname(pathname) {
    if (!pathname) {
      return PAGES_PREFIX + '/';
    }
    if (pathname === PAGES_PREFIX || pathname === PAGES_PREFIX + '/index.html') {
      return PAGES_PREFIX + '/';
    }
    if (pathname.indexOf(PAGES_PREFIX + '/') === 0 && pathname.slice(-11) === '/index.html') {
      return pathname.slice(0, -10);
    }
    return pathname;
  }

  function variantFromPath(pathname) {
    var path = normalizePathname(pathname);
    var match = path.match(/^\/customer-app\/([abc])(?=\/|$)/);
    return match ? match[1] : null;
  }

  function restAfterVariant(pathname) {
    var path = normalizePathname(pathname);
    var variant = variantFromPath(path);
    if (!variant) {
      if (path === PAGES_PREFIX + '/') {
        return '/';
      }
      if (path.indexOf(PAGES_PREFIX + '/') === 0) {
        return path.slice(PAGES_PREFIX.length) || '/';
      }
      return path.charAt(0) === '/' ? path : '/' + path;
    }
    var prefix = PAGES_PREFIX + '/' + variant;
    var rest = path.slice(prefix.length);
    if (!rest || rest === '/') {
      return '/';
    }
    return rest.charAt(0) === '/' ? rest : '/' + rest;
  }

  function urlForVariant(pathname, search, hash, variant) {
    var rest = restAfterVariant(pathname);
    var path = rest === '/' ? PAGES_PREFIX + '/' + variant + '/' : PAGES_PREFIX + '/' + variant + rest;
    return path + stripVariantParam(search) + (hash || '');
  }

  function chooseVariant(queryV, stored, fallback) {
    return normalizeVariant(queryV) || normalizeVariant(stored) || fallback || DEFAULT_VARIANT;
  }

  function resolveLocation(input) {
    var path = normalizePathname(input.pathname);
    var query = queryVariant(input.search);
    var pathVariant = variantFromPath(path);
    var chosen = chooseVariant(query, input.stored);

    if (pathVariant) {
      var variant = query || pathVariant;
      var href = urlForVariant(path, input.search, input.hash, variant);
      var current = path + (input.search || '') + (input.hash || '');
      return { variant: variant, href: href === current ? null : href, persist: variant };
    }

    return {
      variant: chosen,
      href: urlForVariant(path, input.search, input.hash, chosen),
      persist: chosen,
    };
  }

  function readStored() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function writeStored(variant) {
    try {
      window.localStorage.setItem(STORAGE_KEY, variant);
    } catch (error) {
      // Private mode can block storage; switching still works for this load.
    }
  }

  function go(variant) {
    writeStored(variant);
    var target = urlForVariant(location.pathname, location.search, location.hash, variant);
    if (target !== location.pathname + location.search + location.hash) {
      location.href = target;
    }
  }

  function render(active) {
    if (document.getElementById('preview-switcher')) {
      return;
    }

    var nav = document.createElement('nav');
    nav.id = 'preview-switcher';
    nav.setAttribute('aria-label', 'Design preview');

    var label = document.createElement('span');
    label.className = 'preview-switcher-label';
    label.textContent = 'Design';
    nav.appendChild(label);

    VARIANTS.forEach(function (variant) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = variant.toUpperCase();
      button.setAttribute('data-variant', variant);
      button.setAttribute('aria-pressed', variant === active ? 'true' : 'false');
      if (variant === active) {
        button.className = 'is-active';
      }
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        go(variant);
      });
      nav.appendChild(button);
    });

    document.body.appendChild(nav);
  }

  function boot() {
    var resolved = resolveLocation({
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      stored: readStored(),
    });

    if (resolved.persist) {
      writeStored(resolved.persist);
    }

    if (resolved.href) {
      location.replace(resolved.href);
      return;
    }

    render(resolved.variant);
  }

  if (typeof document === 'undefined') {
    return;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
