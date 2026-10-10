import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
function load(path, mocks = {}) {
  const code = ts.transpileModule(fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const loaded = { exports: {} };
  new Function('require', 'module', 'exports', 'process', code)(name => mocks[name] ?? require(name), loaded, loaded.exports, { env: { NEXT_PUBLIC_API_URL: 'https://api.example.test/api' } });
  return loaded.exports;
}
const helpers = load('lib/recruitment.ts');
const question = (type, id = 1) => ({ id, type, required: true, question: `Question ${id}`, help_text: 'Help', options: [{ value: 'one', label: 'One' }, { value: 'two', label: 'Two' }] });
const base = { id: 1, title: 'Test role', slug: 'test', status: 'published', is_open: true, is_indexable: true, valid_through: null, published_at: '2026-01-01T00:00:00Z', region: 'Test', employment_type: 'CONTRACTOR', location_country: 'BE', content: '<h2>Test</h2><p>Content</p>', alternate_slugs: { nl: 'nl-test', fr: 'fr-test', en: 'en-test' }, questions: [], require_cv_or_linkedin: true, max_cv_mb: 5, application_available: true };
function nodes(node) {
  if (!node || typeof node !== 'object') return [];
  if (Array.isArray(node)) return node.flatMap(nodes);
  return [node, ...nodes(node.props?.children)];
}
function harness(vacancy, enabled = false) {
  const slots = []; let cursor = 0; const focus = [];
  const hooks = {
    useRef: value => slots[cursor++] ??= { current: value },
    useState: initial => { const i = cursor++; slots[i] ??= { value: initial }; return [slots[i].value, value => { slots[i].value = typeof value === 'function' ? value(slots[i].value) : value; }]; },
    useEffect: () => { cursor++; },
  };
  const Component = load('components/jobs/ApplicationForm.tsx', {
    react: hooks, 'next-intl': { useLocale: () => 'fr', useTranslations: () => key => key },
    '@/i18n/routing': { Link: 'a' }, '@/lib/recruitment': helpers,
    '@/components/ui/Turnstile': { default: 'turnstile', turnstileEnabled: enabled },
  }).default;
  let tree;
  const render = () => { cursor = 0; tree = nodes(Component({ vacancy, source: { utm_source: 'facebook' } })); for (const n of tree) if (n.props?.ref) n.props.ref.current = { focus: () => focus.push(true) }; return tree; };
  const submit = async () => { await tree.find(n => n.type === 'form').props.onSubmit({ preventDefault() {} }); return render(); };
  return { render, submit, find: predicate => tree.find(predicate), all: predicate => tree.filter(predicate) };
}

test('all question types validate strict values, required and optional inputs', () => {
  for (const [type, value, invalid] of [['yes_no', false, 'yes'], ['single_choice', 'one', 'fake'], ['multiple_choice', ['one'], ['fake']], ['short_text', 'Text', 'x'.repeat(501)], ['long_text', 'Long', 'x'.repeat(5001)]]) {
    assert.equal(helpers.validAnswer(question(type), value), true);
    assert.equal(helpers.validAnswer(question(type), invalid), false);
    assert.equal(helpers.validAnswer(question(type), undefined), false);
    assert.equal(helpers.validAnswer({ ...question(type), required: false }, undefined), true);
  }
  assert.equal(helpers.validAnswer(question('multiple_choice'), ['one', 'one']), false);
});

test('CV, LinkedIn and UTM validation', () => {
  assert.equal(helpers.validCv({ name: 'cv.pdf', type: 'application/pdf', size: 1024 }, 5), true);
  assert.equal(helpers.validCv({ name: 'cv.exe', type: 'application/pdf', size: 1024 }, 5), false);
  assert.equal(helpers.validCv({ name: 'cv.pdf', type: 'application/pdf', size: 6 * 1024 * 1024 }, 5), false);
  assert.equal(helpers.validLinkedIn('https://www.linkedin.com/in/test'), true);
  assert.equal(helpers.validLinkedIn('https://linkedin.com.evil.test/in/test'), false);
  assert.deepEqual(helpers.recruitmentSource({ utm_source: 'facebook', email: 'private@example.test', answers: 'private', utm_content: 'a' }), { utm_source: 'facebook', utm_content: 'a' });
});

test('progress, required error, previous/next and final personal step retain answers', async () => {
  const h = harness({ ...base, questions: [question('yes_no'), question('short_text', 2)] });
  h.render(); assert.equal(h.find(n => n.type === 'progress').props.max, 3);
  assert.equal(h.find(n => n.type === 'turnstile'), undefined);
  await h.submit(); assert.equal(h.find(n => n.props?.role === 'alert').props.children, 'answerError');
  h.all(n => n.type === 'input')[1].props.onChange(); h.render(); await h.submit();
  assert.equal(h.find(n => n.type === 'progress').props.value, 2);
  h.find(n => n.type === 'input').props.onChange({ target: { value: 'Experience' } }); h.render(); await h.submit();
  assert.ok(h.find(n => n.type === 'turnstile'));
  assert.ok(h.find(n => n.type === 'input' && n.props.type === 'file'));
  h.find(n => n.type === 'button' && n.props.children === 'previous').props.onClick(); h.render();
  assert.equal(h.find(n => n.type === 'input').props.value, 'Experience');
  await h.submit(); await h.submit();
  assert.equal(h.find(n => n.props?.role === 'alert').props.children, 'cvRequired');
});

test('final step sends multipart, preserves locale/source and gates on Turnstile', async () => {
  const old = global.fetch; const sent = [];
  global.fetch = async (url, options) => { sent.push([url, options]); return { ok: true, json: async () => ({ success: true }) }; };
  try {
    const h = harness({ ...base, require_cv_or_linkedin: false }, true); h.render();
    assert.equal(h.find(n => n.props?.type === 'submit').props.disabled, true);
    h.find(n => n.type === 'input' && n.props.type === 'checkbox').props.onChange({ target: { checked: true } });
    h.find(n => n.type === 'turnstile').props.onToken('test-token'); h.render();
    await h.submit();
    assert.equal(sent.length, 1); const body = sent[0][1].body;
    assert.ok(body instanceof FormData); assert.equal(body.get('locale'), 'fr'); assert.equal(body.get('utm_source'), 'facebook');
    assert.equal(body.get('turnstile_token'), 'test-token'); assert.equal(body.get('answers'), '{}');
    assert.ok(h.find(n => n.props?.role === 'status'));
  } finally { global.fetch = old; }
});

test('validation error resets Turnstile; recorded mail failure prevents duplicate resubmit', async () => {
  const old = global.fetch;
  try {
    let recorded = false;
    global.fetch = async () => ({ ok: false, status: recorded ? 503 : 422, json: async () => ({ recorded }) });
    const h = harness({ ...base, require_cv_or_linkedin: false }, true); h.render();
    h.find(n => n.type === 'input' && n.props.type === 'checkbox').props.onChange({ target: { checked: true } });
    h.find(n => n.type === 'turnstile').props.onToken('token'); h.render();
    const before = h.find(n => n.type === 'turnstile').key;
    await h.submit(); assert.notEqual(h.find(n => n.type === 'turnstile').key, before);
    assert.equal(h.find(n => n.props?.type === 'submit').props.disabled, true);
    recorded = true; h.find(n => n.type === 'turnstile').props.onToken('new-token'); h.render(); await h.submit();
    assert.ok(h.find(n => n.type === 'h2' && n.props.children === 'mailFailedTitle'));
    assert.equal(h.find(n => n.type === 'form'), undefined);
  } finally { global.fetch = old; }
});

test('localized pages render, closed job hides form, shared rich text preserves HTML', async () => {
  const rich = load('components/ui/RichTextContent.tsx').default({ html: base.content });
  assert.equal(rich.props.dangerouslySetInnerHTML.__html, base.content);
  assert.match(rich.props.className, /\[&_table\]/);
  const routing = load('i18n/config.ts', { 'next-intl/routing': { defineRouting: value => value } }).routing;
  assert.deepEqual(routing.pathnames['/jobs'], { nl: '/vacatures', fr: '/offres-emploi', en: '/jobs' });
  for (const locale of ['nl', 'fr', 'en']) {
    let open = true;
    const mocks = {
      'next-intl/server': { getTranslations: async () => key => key }, '@/i18n/routing': { Link: 'a' },
      '@/components/ui/Breadcrumbs': { default: 'breadcrumbs' }, '@/lib/vacancies': { getVacancies: async () => [base], getVacancy: async () => ({ ...base, is_open: open }) },
      '@/lib/seo/metadata': { pageMetadata: (...args) => args }, '@/lib/recruitment': helpers,
      'next/image': { default: 'image' }, 'next/navigation': { notFound: () => { throw Error('404'); } },
      '@/components/ui/RichTextContent': { default: 'rich-text' }, '@/components/seo/JsonLd': { default: 'schema' },
      '@/components/jobs/ApplicationForm': { default: 'application' }, '@/components/jobs/VacancyAlternateLinks': { default: 'alternates' },
      '@/lib/seo/job-schema': { jobSchema: () => null },
    };
    const props = { params: Promise.resolve({ locale, slug: base.slug }), searchParams: Promise.resolve({ utm_source: 'campaign' }) };
    const list = load('app/[locale]/jobs/page.tsx', mocks);
    assert.ok(nodes(await list.default(props)).some(n => n.type === 'h1'));
    const detail = load('app/[locale]/jobs/[slug]/page.tsx', mocks);
    assert.ok(nodes(await detail.default(props)).some(n => n.type === 'application'));
    open = false;
    assert.equal(nodes(await detail.default(props)).some(n => n.type === 'application'), false);
    assert.equal((await detail.generateMetadata(props))[3].indexable, false);
  }
});

test('JobPosting only for active indexable detail, real dates and no salary', async () => {
  const schema = load('lib/seo/job-schema.ts', { 'server-only': {}, './config': { siteOrigin: () => 'https://www.nu-isoleren.be', publicImage: () => undefined }, './schema': { businessSchema: async () => ({ '@id': 'https://www.nu-isoleren.be/#organization', name: 'Nu-Isoleren', url: 'https://www.nu-isoleren.be', logo: 'https://www.nu-isoleren.be/logo/logo.webp' }) }, './urls': { localizedPath: (_, locale, slug) => `/${locale}/jobs/${slug}` }, '@/lib/recruitment': helpers }).jobSchema;
  assert.equal((await schema(base, 'nl'))['@type'], 'JobPosting');
  assert.equal((await schema(base, 'nl')).employmentType, 'CONTRACTOR');
  assert.equal((await schema(base, 'nl')).baseSalary, undefined);
  assert.equal(await schema({ ...base, is_open: false }, 'nl'), null);
  assert.equal(await schema({ ...base, valid_through: '2020-01-01' }, 'nl'), null);
  assert.equal(await schema({ ...base, is_indexable: false }, 'nl'), null);
});

test('sitemap includes real translated open jobs and excludes closed/expired/noindex', async () => {
  const routing = load('i18n/config.ts', { 'next-intl/routing': { defineRouting: value => value } }).routing;
  const entries = [
    { type: 'vacancies', id: 1, slugs: { nl: 'functie', fr: 'fonction' }, is_indexable: true, updated_at: '2026-01-01T10:00:00Z' },
    { type: 'vacancies', id: 2, slugs: { nl: 'expired' }, is_indexable: true, valid_through: '2020-01-01T00:00:00Z' },
    { type: 'vacancies', id: 3, slugs: { nl: 'private' }, is_indexable: false },
  ];
  const result = await load('app/sitemap.ts', {
    '@/i18n/routing': { routing }, '@/lib/seo/config': { indexingEnabled: () => true, siteOrigin: () => 'https://www.nu-isoleren.be' },
    '@/lib/seo/inventory': { getSeoInventory: async () => entries },
    '@/lib/seo/urls': { contentRoutes: { vacancies: '/jobs/[slug]' }, languageTags: { nl: 'nl-BE', fr: 'fr-BE', en: 'en' }, localizedPath: (route, locale, slug) => { const pathname = routing.pathnames[route]; return `/${locale}${(typeof pathname === 'string' ? pathname : pathname[locale]).replace('[slug]', slug ?? '')}`; } },
  }).default();
  const job = result.find(item => item.url === 'https://www.nu-isoleren.be/nl/vacatures/functie');
  assert.equal(job.lastModified, '2026-01-01T10:00:00Z');
  assert.deepEqual(job.alternates.languages, { 'nl-BE': job.url, 'fr-BE': 'https://www.nu-isoleren.be/fr/offres-emploi/fonction', 'x-default': job.url });
  assert.equal(result.some(item => /expired|private/.test(item.url)), false);
  assert.equal(result.some(item => /en\/jobs\/functie/.test(item.url)), false);
});
