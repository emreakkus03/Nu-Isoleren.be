import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const loaded = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  new Function('require', 'module', 'exports', code)(name => mocks[name] || require(name), loaded, loaded.exports);
  return loaded.exports;
}
function walk(node) {
  if (!node || typeof node !== 'object') return [];
  if (Array.isArray(node)) return node.flatMap(walk);
  return [node, ...walk(node.props?.children)];
}
const routing = load('i18n/config.ts', { 'next-intl/routing': { defineRouting: value => value } }).routing;
for (const kind of ['contact', 'quote']) for (const locale of ['nl', 'fr', 'en']) {
  test(`${kind} ${locale}: confirmed success redirects; duplicates blocked; failures remain retryable`, async () => {
    const state = []; let cursor = 0; const navigations = []; let requests = 0; let resolveResponse;
    const previousFetch = global.fetch; const previousApi = process.env.NEXT_PUBLIC_API_URL;
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.test';
    global.fetch = async (_url, options) => { requests++; assert.equal(JSON.parse(options.body).locale, locale); return new Promise(resolve => { resolveResponse = resolve; }); };
    const hooks = {
      useState: initial => { const index = cursor++; if (!(index in state)) state[index] = initial; return [state[index], value => { state[index] = typeof value === 'function' ? value(state[index]) : value; }]; },
      useRef: initial => { const index = cursor++; return state[index] ??= { current: initial }; },
    };
    const file = `components/${kind}/${kind === 'contact' ? 'Contact' : 'Quote'}Form.tsx`;
    const Component = load(file, {
      react: hooks,
      'next-intl': { useLocale: () => locale, useTranslations: () => key => key },
      '@/i18n/routing': { Link: 'a', useRouter: () => ({ replace: route => navigations.push('/' + locale + routing.pathnames[route][locale]) }) },
    }).default;
    function render() { cursor = 0; return walk(Component({ services: [{ id: 1, name: 'Service' }], initialServiceIds: [1], locale, apiUrl: 'https://api.example.test' })); }
    try {
      let nodes = render();
      nodes.find(node => node.type === 'input' && node.props.type === 'checkbox').props.onChange({ target: { checked: true } });
      for (const response of [{ ok: false, body: { success: false } }, { ok: true, body: { success: false } }, { ok: true, body: { success: true } }]) {
        nodes = render(); const submit = nodes.find(node => node.type === 'form').props.onSubmit; const before = requests;
        const pending = submit({ preventDefault() {} }); await submit({ preventDefault() {} }); assert.equal(requests, before + 1);
        resolveResponse({ ok: response.ok, json: async () => response.body }); await pending;
        nodes = render();
        if (!response.ok || !response.body.success) {
          assert.equal(navigations.length, 0); assert(nodes.some(node => node.props?.children === (kind === 'contact' ? 'error' : 'errors.submit')));
          assert.equal(nodes.find(node => node.type === 'button' && node.props.type === 'submit').props.disabled, false);
        }
      }
      const route = '/thank-you/' + kind; assert.deepEqual(navigations, ['/' + locale + routing.pathnames[route][locale]]);
      assert(!navigations[0].includes('?')); assert.equal(render().find(node => node.type === 'button' && node.props.type === 'submit').props.disabled, true);
    } finally {
      global.fetch = previousFetch;
      if (previousApi === undefined) delete process.env.NEXT_PUBLIC_API_URL; else process.env.NEXT_PUBLIC_API_URL = previousApi;
    }
  });
}
test('new pages use noindex metadata and sitemap excludes thank-you routes', async () => {
  for (const route of ['thank-you/contact', 'thank-you/quote', 'privacy-policy', 'cookie-policy']) {
    const page = load(`app/[locale]/${route}/page.tsx`, {
      'next-intl/server': { getTranslations: async () => key => key },
      '@/lib/seo/metadata': { pageMetadata: (key, locale, values, options) => ({ key, locale, values, options }) },
      '@/components/legal/ThankYouPage': {}, '@/components/legal/PolicyPage': {},
    });
    assert.equal((await page.generateMetadata({ params: Promise.resolve({ locale: 'fr' }) })).options.indexable, false);
  }
  const sitemap = load('app/sitemap.ts', {
    '@/i18n/routing': { routing },
    '@/lib/seo/config': { indexingEnabled: () => true, siteOrigin: () => 'https://nu-isoleren.be' },
    '@/lib/seo/inventory': { getSeoInventory: async () => [] },
    '@/lib/seo/urls': { contentRoutes: {}, languageTags: { nl: 'nl-BE', fr: 'fr-BE', en: 'en' }, localizedPath: (route, locale) => '/' + locale + (typeof routing.pathnames[route] === 'string' ? routing.pathnames[route] : routing.pathnames[route][locale]) },
  }).default;
  assert((await sitemap()).every(entry => !/bedankt|merci|thank-you/.test(entry.url)));
});
