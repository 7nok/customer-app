import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const STYLESHEET =
  '<link rel="stylesheet" href="/customer-app/preview-switcher.css" data-preview-switcher="css" />';

const INLINE_REDIRECT = `<script data-preview-switcher="redirect">
(function(){
  var KEY='customer-app-variant';
  var here=location.pathname.match(/^\\/customer-app\\/([abc])(?=\\/|$)/);
  var q;
  try { q=(new URLSearchParams(location.search).get('v')||'').toLowerCase(); } catch(e) { q=''; }
  if(q!=='a'&&q!=='b'&&q!=='c') return;
  try { localStorage.setItem(KEY,q); } catch(e) {}
  if(here && q!==here[1]){
    location.replace(location.pathname.replace(/^\\/customer-app\\/[abc]/,'/customer-app/'+q)+location.search+location.hash);
  }
})();
</script>`;

const SCRIPT =
  '<script src="/customer-app/preview-switcher.js" defer data-preview-switcher="ui"></script>';

function walkHtml(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const next = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtml(next, files);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(next);
    }
  }
  return files;
}

function injectOnce(html, needle, insertion, before) {
  if (html.includes(insertion)) {
    return html;
  }
  const index = html.toLowerCase().lastIndexOf(needle);
  if (index === -1) {
    return before ? `${insertion}\n${html}` : `${html}\n${insertion}`;
  }
  return `${html.slice(0, index)}${insertion}\n${html.slice(index)}`;
}

export function injectSwitcherMarkup(html) {
  let next = html;
  if (!next.includes('data-preview-switcher="css"')) {
    next = injectOnce(next, '</head>', `    ${STYLESHEET}\n    ${INLINE_REDIRECT}\n`, true);
  }
  if (!next.includes('data-preview-switcher="ui"')) {
    next = injectOnce(next, '</body>', `    ${SCRIPT}\n`, false);
  }
  return next;
}

export function injectSwitcherIntoDist(variantDir) {
  const files = walkHtml(variantDir);
  for (const file of files) {
    const before = readFileSync(file, 'utf8');
    const after = injectSwitcherMarkup(before);
    if (after !== before) {
      writeFileSync(file, after);
    }
  }
  return files.length;
}
