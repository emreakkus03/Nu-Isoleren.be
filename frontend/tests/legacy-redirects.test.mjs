import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

function load(file, mocks) {
  const loaded = { exports: {} };
  const compiled = ts.transpileModule(fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function('require', 'exports', compiled)(name => {
    assert(name in mocks, `Unexpected dependency ${name}`);
    return mocks[name];
  }, loaded.exports);
  return loaded.exports;
}
const { routing } = load('i18n/config.ts', { 'next-intl/routing': { defineRouting: value => value } });
const config = load('next.config.ts', { './i18n/config': { routing }, 'next-intl/plugin': { default: () => value => value } }).default;
const redirects = await config.redirects();
const legacy = redirects.filter(rule => !rule.has && !/^\/(nl|fr|en)(\/|$)/.test(rule.source));
for (const [name, source, destination] of [
  ['dienst', '/spouwmuurisolatie', '/nl/diensten/spouwmuurisolatie'],
  ['materiaal', '/eps-isolatie', '/nl/eps-isolatie'],
  ['werkgebied', '/isolatie-aalst', '/nl/werkgebieden/aalst'],
  ['oude spelling', '/isolatie-roeselaere', '/nl/werkgebieden/roeselare'],
  ['privacy', '/privacy-policy', '/nl/privacybeleid'],
  ['Brussel fallback', '/isolatie-brussel', '/nl/werkgebieden'],
]) test(name, () => assert.deepEqual(legacy.find(rule => rule.source === source), { source, destination, permanent: true }));
for (const path of ['/nl/diensten/spouwmuurisolatie', '/fr/services/isolation-murs-creux', '/en/services/cavity-wall-insulation', '/blog/voorbeeld', '/']) {
  test(`${path} heeft geen nieuwe legacy redirect`, () => assert(!legacy.some(rule => rule.source === path)));
}
test('65 exacte legacyregels; hostredirect apart; geen chains; locale-aliases behouden', () => {
  assert.equal(legacy.length, 65);
  assert.equal(new Set(legacy.map(rule => rule.source)).size, 65);
  for (const rule of legacy) {
    assert.equal(rule.permanent, true);
    assert(!/[:*?]/.test(rule.source));
    assert(rule.destination.startsWith('/nl/'));
    assert(!redirects.filter(other => !other.has).some(other => new RegExp('^' + other.source.replace(':slug', '[^/]+') + '$').test(rule.destination)));
  }
  const originalAliases = Object.entries(routing.pathnames).flatMap(([key, localized]) => routing.locales.flatMap(locale => {
    const destination = typeof localized === 'string' ? localized : localized[locale];
    return key === destination ? [] : [{ source: `/${locale}${key.replace('[slug]', ':slug')}`, destination: `/${locale}${destination.replace('[slug]', ':slug')}`, permanent: true }];
  }));
  assert.deepEqual(redirects.filter(rule => !rule.has && !legacy.includes(rule)), originalAliases);
});
test('root krijgt geen duplicerende redirect en behoudt NL als defaultLocale', () => {
  assert.equal(routing.defaultLocale, 'nl');
  assert(!redirects.some(rule => rule.source === '/'));
});


test('bewuste blogmigratie en hostredirect blijven behouden', () => {
  assert.deepEqual(legacy.find(rule => rule.source === '/blog'), { source: '/blog', destination: '/nl/kennisbank', permanent: true });
  assert.equal(legacy.filter(rule => rule.source.startsWith('/blog')).length, 13);
  assert.equal(legacy.filter(rule => rule.source.startsWith('/werkgebied/')).length, 20);
  assert.deepEqual(redirects.filter(rule => rule.has), [{ source: '/:path*', has: [{ type: 'host', value: 'nu-isoleren.be' }], destination: 'https://www.nu-isoleren.be/:path*', permanent: true }]);
});

test('geen genormaliseerde self-redirects of dubbele regels', () => {
  const normalize = value => new URL(value.replace(/:slug/g, 'test-slug').replace(/:path\*/g, 'test-path'), 'https://nu-isoleren.be').href.replace(/\/$/, '');
  const seen = new Set();
  for (const rule of redirects) {
    assert.notEqual(normalize(rule.source), normalize(rule.destination));
    const key = JSON.stringify([rule.source, rule.has ?? []]);
    assert(!seen.has(key)); seen.add(key);
  }
});

test('vacature overview/detail publieke routes krijgen geen aliasredirect en behouden taaldetectie', () => {
  assert.notEqual(routing.localeDetection, false);
  for (const [locale, publicPath] of [['nl', '/vacatures'], ['fr', '/offres-emploi'], ['en', '/jobs']]) {
    for (const suffix of ['', '/test-slug']) {
      const key = suffix ? '/jobs/[slug]' : '/jobs';
      assert.equal(routing.pathnames[key][locale].replace('[slug]', 'test-slug'), publicPath + suffix);
      const path = `/${locale}${publicPath}${suffix}`;
      assert(!redirects.filter(rule => !rule.has).some(rule => new RegExp('^' + rule.source.replace(':slug', '[^/]+') + '$').test(path)));
    }
  }
});
