import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, '..');
function loader(mocks = {}) {
  const modules = new Map();
  function load(file) {
    const filename = path.resolve(root, file);
    if (modules.has(filename)) return modules.get(filename).exports;
    const loaded = { exports: {} }; modules.set(filename, loaded);
    const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    new Function('require', 'module', 'exports', code)(name => {
      if (name in mocks) return mocks[name];
      if (name === 'server-only') return {};
      if (name === 'next-intl/navigation') return { createNavigation: routing => ({ getPathname: ({ locale, href }) => {
        const key = typeof href === 'string' ? href : href.pathname;
        const paths = routing.pathnames[key];
        const pathname = typeof paths === 'string' ? paths : paths[locale];
        return '/' + locale + pathname.replace('[slug]', typeof href === 'string' ? '' : encodeURIComponent(href.params.slug));
      } }) };
      if (name.startsWith('@/')) return load(name.slice(2) + '.ts');
      if (name.startsWith('.')) return load(path.relative(root, path.resolve(path.dirname(filename), name)) + '.ts');
      return require(name);
    }, loaded, loaded.exports);
    return loaded.exports;
  }
  return load;
}
const load = loader();
const { resolveRichTextLink: resolve, normalizeRichTextHtml: html, needsRichTextInventory } = load('lib/rich-text-links.ts');
const routing = load('i18n/config.ts').routing;
const inventory = [
  { type: 'services', id: 1, slugs: { nl: 'spouwmuurisolatie', fr: 'isolation-murs-creux', en: 'cavity-wall-insulation' } },
  { type: 'articles', id: 2, slugs: { nl: 'advies', fr: 'conseils', en: 'advice' } },
  { type: 'projects', id: 3, slugs: { nl: 'woning', fr: 'maison', en: 'house' } },
  { type: 'vacancies', id: 4, slugs: { nl: 'monteur', fr: 'installateur', en: 'installer' } },
  { type: 'cities', id: 5, slugs: { nl: 'gent', fr: 'gand', en: 'ghent' } },
  { type: 'materials', id: 6, slugs: { nl: 'glaswol-isolatie', fr: 'laine-de-verre', en: 'glass-wool' } },
];
for (const locale of ['nl', 'fr', 'en']) {
  test(`all static routes and localized aliases render directly for ${locale}`, () => {
    for (const [route, paths] of Object.entries(routing.pathnames)) {
      if (route.includes('[slug]')) continue;
      const target = '/' + locale + (typeof paths === 'string' ? paths : paths[locale]);
      for (const source of [route, ...(typeof paths === 'string' ? [paths] : Object.values(paths))]) assert.equal(resolve(source + '?x=1#section', locale), target + '?x=1#section');
    }
    const output = html('<p><a href="/quote">Quote</a></p>', locale);
    const rendered = renderToStaticMarkup(createElement('div', { dangerouslySetInnerHTML: { __html: output } }));
    assert.ok(rendered.includes(`href="/${locale}${routing.pathnames['/quote'][locale]}"`));
  });
  test(`legacy localized and neutral detail paths use real ${locale} CMS slugs`, () => {
    const expected = [
      ['/diensten/spouwmuurisolatie', 'services'], ['/services/cavity-wall-insulation', 'services'],
      ['/kennisbank/advies', 'articles'], ['/knowledge/advice', 'articles'], ['/realisaties/woning', 'projects'],
      ['/vacatures/monteur', 'vacancies'], ['/jobs/installer', 'vacancies'], ['/werkgebieden/gent', 'cities'], ['/glaswol-isolatie', 'materials'],
    ];
    const { contentRoutes, localizedPath } = load('lib/seo/urls.ts');
    for (const [source, type] of expected) {
      const entry = inventory.find(item => item.type === type);
      assert.equal(resolve(source + '?x=1#details', locale, inventory), localizedPath(contentRoutes[type], locale, entry.slugs[locale]) + '?x=1#details');
    }
  });
}
test('explicit locale links preserve editorial language and never duplicate prefixes', () => {
  assert.equal(resolve('/fr/merci/candidature', 'nl'), '/fr/merci/candidature');
  assert.equal(resolve('/nl/gratis-offerte', 'fr'), '/nl/gratis-offerte');
  assert.equal(resolve('/fr/quote', 'en'), '/fr/devis-gratuit');
  assert.equal(resolve('/fr/services/isolation-murs-creux', 'nl', inventory), '/fr/services/isolation-murs-creux');
  assert.equal(resolve('/en/services/spouwmuurisolatie', 'nl', inventory), '/en/services/cavity-wall-insulation');
});
test('external, protocol-relative, email, phone, anchors, files and unknown paths stay intact', () => {
  for (const href of ['https://www.nu-isoleren.be/quote', 'http://example.com', '//example.com/quote', 'mailto:a@example.com', 'tel:+321234', '#application', '/files/guide.pdf?download=1', '/logo/logo.svg', '/unknown', 'relative-link', '/services/missing']) assert.equal(resolve(href, 'nl', inventory), href);
  assert.equal(html('<a download href="/quote">File</a>', 'fr'), '<a download href="/quote">File</a>');
});
test('missing translations and ambiguous records never invent slugs', () => {
  assert.equal(resolve('/diensten/spouwmuurisolatie', 'fr', [{ ...inventory[0], slugs: { nl: 'spouwmuurisolatie' } }]), '/diensten/spouwmuurisolatie');
  assert.equal(resolve('/diensten/spouwmuurisolatie', 'fr', [inventory[0], { ...inventory[0], id: 99 }]), '/diensten/spouwmuurisolatie');
});
test('HTML preserves markup, quote variants, entities, attributes, comments and raw text', () => {
  const input = `<p class="body"><a title="href='/quote' >" data-href="/quote" href='/quote?a=1&amp;b=2#ok'>Go</a><a HREF=/faq>FAQ</a><img src="/quote"></p><!-- <a href="/quote"> --><script>const x='<a href="/quote">';</script><textarea><a href="/quote"></textarea>`;
  const output = html(input, 'nl');
  assert.ok(output.includes('href="/nl/gratis-offerte?a=1&amp;b=2#ok"'));
  assert.ok(output.includes('HREF="/nl/veelgestelde-vragen"'));
  assert.ok(output.includes(`title="href='/quote' >" data-href="/quote"`));
  assert.ok(output.includes('<img src="/quote">'));
  assert.ok(output.endsWith(input.slice(input.indexOf('<!--'))));
  assert.equal(html(output, 'nl'), output);
  assert.equal(needsRichTextInventory('<a href="/quote">Go</a>', 'nl'), false);
});
test('server CMS boundary localizes nested rich text before both server and client consumers', async () => {
  let calls = 0;
  const cms = loader({ '@/lib/seo/inventory': { getSeoInventory: async () => { calls++; return inventory; } } })('lib/cms-rich-text.ts');
  const data = { intro: '<a href="/quote">Quote</a>', sections: [{ body: '<a href="/diensten/spouwmuurisolatie">Service</a>' }], faqs: [{ answer: '<a href="/jobs/monteur">Job</a>' }], image: '/photo.jpg', id: 1 };
  const output = await cms.localizeCmsRichText(data, 'en');
  assert.equal(calls, 1);
  assert.ok(output.intro.includes('/en/free-quote'));
  assert.ok(output.sections[0].body.includes('/en/services/cavity-wall-insulation'));
  assert.ok(output.faqs[0].answer.includes('/en/jobs/installer'));
  assert.equal(output.image, data.image);
  assert.equal(data.intro, '<a href="/quote">Quote</a>');
  await cms.localizeCmsRichText({ body: '<a href="/quote">Quote</a>' }, 'nl');
  assert.equal(calls, 1);
});
test('inventory outage keeps detail URLs intact while static links still work', async () => {
  const cms = loader({ '@/lib/seo/inventory': { getSeoInventory: async () => { throw Error('Unavailable'); } } })('lib/cms-rich-text.ts');
  const output = await cms.localizeCmsRichText('<a href="/quote">Quote</a><a href="/diensten/spouwmuurisolatie">Service</a>', 'fr');
  assert.ok(output.includes('/fr/devis-gratuit'));
  assert.ok(output.includes('href="/diensten/spouwmuurisolatie"'));
});
test('every existing CMS detail loader and FAQ loader supplies normalized rendering HTML', async () => {
  for (const [file, method, payload, args] of [
    ['services', 'getServiceBySlug', { data: { description: '<a href="/quote">Go</a>' } }, ['test', 'fr']],
    ['knowledge', 'getKnowledgeArticleBySlug', { data: { intro: '<a href="/quote">Go</a>' } }, ['test', 'fr']],
    ['projects', 'getProjectBySlug', { description: '<a href="/quote">Go</a>' }, ['test', 'fr']],
    ['cities', 'getCityBySlug', { hero_intro: '<a href="/quote">Go</a>' }, ['test', 'fr']],
    ['materials', 'getMaterial', { data: { sections: [{ body: '<a href="/quote">Go</a>' }] } }, ['test', 'fr']],
    ['vacancies', 'getVacancy', { data: { content: '<a href="/quote">Go</a>' } }, ['fr', 'test']],
    ['faqs', 'getFaqs', { data: [{ answer: '<a href="/quote">Go</a>' }] }, ['fr']],
  ]) {
    const modules = loader({
      '@/lib/seo/inventory': { getSeoInventory: async () => inventory },
      'next-intl/server': { getLocale: async () => 'fr' },
      './content-api': { contentRequest: async () => ({ ok: true, status: 200, json: async () => payload }) },
      '@/lib/content-api': { contentRequest: async () => ({ ok: true, status: 200, json: async () => payload }) },
    });
    const result = await modules(`lib/${file}.ts`)[method](...args);
    assert.ok(JSON.stringify(result).includes('/fr/devis-gratuit'), file);
  }
});
