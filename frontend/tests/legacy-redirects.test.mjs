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
const legacy = redirects.filter(rule => !/^\/(nl|fr|en)(\/|$)/.test(rule.source));
for (const [name, source, destination] of [
  ['dienst', '/spouwmuurisolatie', '/nl/diensten/spouwmuurisolatie'],
  ['materiaal', '/eps-isolatie', '/nl/eps-isolatie'],
  ['werkgebied', '/isolatie-aalst', '/nl/werkgebieden/aalst'],
  ['oude spelling', '/isolatie-roeselaere', '/nl/werkgebieden/roeselare'],
  ['privacy', '/privacy-policy', '/nl/privacybeleid'],
  ['Brussel fallback', '/isolatie-brussel', '/nl/werkgebieden'],
]) test(name, () => assert.deepEqual(legacy.find(rule => rule.source === source), { source, destination, permanent: true }));
for (const path of ['/nl/diensten/spouwmuurisolatie', '/fr/services/isolation-murs-creux', '/en/services/cavity-wall-insulation', '/blog/voorbeeld', '/blog', '/']) {
  test(`${path} heeft geen nieuwe legacy redirect`, () => assert(!legacy.some(rule => rule.source === path)));
}
test('32 exacte unieke regels; geen chains; bestaande locale-aliases ongewijzigd', () => {
  assert.equal(legacy.length, 32);
  assert.equal(new Set(legacy.map(rule => rule.source)).size, 32);
  for (const rule of legacy) {
    assert.equal(rule.permanent, true);
    assert(!/[:*?]/.test(rule.source));
    assert(rule.destination.startsWith('/nl/'));
    assert(!redirects.some(other => new RegExp('^' + other.source.replace(':slug', '[^/]+') + '$').test(rule.destination)));
  }
  const originalAliases = Object.entries(routing.pathnames).flatMap(([key, localized]) => routing.locales.flatMap(locale => {
    const destination = typeof localized === 'string' ? localized : localized[locale];
    return key === destination ? [] : [{ source: `/${locale}${key.replace('[slug]', ':slug')}`, destination: `/${locale}${destination.replace('[slug]', ':slug')}`, permanent: true }];
  }));
  assert.deepEqual(redirects.filter(rule => !legacy.includes(rule)), originalAliases);
});
test('root krijgt geen duplicerende redirect en behoudt NL als defaultLocale', () => {
  assert.equal(routing.defaultLocale, 'nl');
  assert(!redirects.some(rule => rule.source === '/'));
});
