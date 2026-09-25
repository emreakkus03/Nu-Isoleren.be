import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const loaded = { exports: {} };
  const compiled = ts.transpileModule(fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const resolve = name => name === 'server-only' ? {} : mocks[name] || require(name);
  new Function('require', 'module', 'exports', compiled)(resolve, loaded, loaded.exports);
  return loaded.exports;
}
const security = load('lib/seo/revalidation.ts');

test('revalidation authentication and allowed tags', () => {
  const secret = 's'.repeat(32);
  assert.equal(security.authorized(null, secret), false);
  assert.equal(security.authorized('Bearer wrong', secret), false);
  assert.equal(security.authorized('Bearer ' + secret, secret), true);
  assert.equal(security.authorized('Bearer short', 'short'), false);
  assert.deepEqual(security.validatedTags({ tags: ['services', 'services', 'sitemap'] }), ['services', 'sitemap']);
  for (const input of [null, { tags: [] }, { tags: ['*'] }, { tags: ['services'], path: '/' }]) assert.equal(security.validatedTags(input), null);
});

test('endpoint refuses unauthorized and invalid purges and acknowledges valid invalidation', async () => {
  const previous = process.env.REVALIDATION_SECRET;
  process.env.REVALIDATION_SECRET = 's'.repeat(32);
  const invalidated = [];
  const { POST } = load('app/api/revalidate/route.ts', { 'next/cache': { revalidateTag: (...args) => invalidated.push(args) }, '@/lib/seo/revalidation': security });
  const request = (payload, token = process.env.REVALIDATION_SECRET) => new Request('https://example.test/api/revalidate', { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  try {
    assert.equal((await POST(request({ tags: ['services'] }, 'wrong'))).status, 401);
    assert.equal((await POST(request({ tags: ['*'] }))).status, 400);
    assert.deepEqual(invalidated, []);
    assert.equal((await POST(request({ tags: ['services', 'sitemap'] }))).status, 200);
    assert.deepEqual(invalidated, [['services', { expire: 0 }], ['sitemap', { expire: 0 }]]);
    assert.equal((await POST(request({ tags: ['x'.repeat(2200)] }))).status, 413);
  } finally { if (previous === undefined) delete process.env.REVALIDATION_SECRET; else process.env.REVALIDATION_SECRET = previous; }
});

test('non-production emits no production origin and local media is excluded', () => {
  const previous = { ...process.env };
  const config = load('lib/seo/config.ts');
  try {
    process.env.DEPLOYMENT_ENV = 'staging';
    process.env.SEO_INDEXING_ENABLED = 'true';
    assert.equal(config.siteOrigin(), null);
    assert.equal(config.indexingEnabled(), false);
    process.env.DEPLOYMENT_ENV = 'production';
    process.env.SITE_URL = 'https://nu-isoleren.be';
    assert.equal(config.siteOrigin(), 'https://nu-isoleren.be');
    assert.equal(config.publicImage('http://127.0.0.1/image.jpg'), undefined);
    process.env.SITE_URL = 'http://localhost:3000';
    assert.throws(() => config.siteOrigin());
  } finally { process.env = previous; }
});

test('JSON-LD serialization cannot close its script element', () => {
  const { serializeJsonLd } = load('lib/seo/json.ts');
  const content = { text: '</script><script>alert(1)</script>' };
  const serialized = serializeJsonLd(content);
  assert.equal(serialized.includes('<'), false);
  assert.deepEqual(JSON.parse(serialized), content);
});
