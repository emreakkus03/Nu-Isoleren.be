import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { createTranslator } from 'next-intl';
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
    react: hooks, 'next-intl': { useLocale: () => 'fr', useTranslations: () => Object.assign(key => key, { rich: (_, values) => values.policy('privacyLink') }) },
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
    const h = harness(base, true); h.render();
    assert.equal(h.find(n => n.props?.type === 'submit').props.disabled, true);
    const values = ['Ada', 'Test', 'ada@example.test', '123', 'Teststad'];
    values.forEach((value, index) => {
      h.all(n => n.type === 'input' && n.props.autoComplete)[index].props.onChange({ target: { value } });
      h.render();
    });
    h.find(n => n.type === 'input' && n.props.type === 'url').props.onChange({ target: { value: 'https://www.linkedin.com/in/test' } });
    h.render();
    h.find(n => n.type === 'input' && n.props.type === 'checkbox').props.onChange({ target: { checked: true } });
    h.find(n => n.type === 'turnstile').props.onToken('test-token'); h.render();
    await h.submit();
    assert.equal(sent.length, 1); const body = sent[0][1].body;
    assert.ok(body instanceof FormData); assert.equal(body.get('locale'), 'fr'); assert.equal(body.get('utm_source'), 'facebook');
    assert.equal(body.get('turnstile_token'), 'test-token'); assert.equal(body.get('answers'), '{}');
    assert.equal(body.get('first_name'), 'Ada'); assert.equal(body.get('email'), 'ada@example.test');
    assert.equal(body.get('linkedin_url'), 'https://www.linkedin.com/in/test');
    assert.equal(body.get('privacy_accepted'), '1');
    assert.ok(h.find(n => n.props?.role === 'status'));
    assert.ok(h.find(n => n.props?.href === '/jobs' && n.props.children === 'otherJobs'));
    assert.ok(h.find(n => n.type === 'h2' && n.props.children === 'successTitle'));
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
    const openDetail = nodes(await detail.default(props));
    assert.ok(openDetail.some(n => n.type === 'application'));
    assert.equal(openDetail.filter(n => n.props?.href === '#application').length, 1);
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


test('open vacancy count excludes drafts, closed, expired and unpublished records', async () => {
  const entries = [base, { ...base, status: 'draft' }, { ...base, is_open: false }, { ...base, valid_through: '2000-01-01' }, { ...base, published_at: null }, { ...base, published_at: '2999-01-01' }];
  const { getVacancies } = load('lib/vacancies.ts', {
    'server-only': {}, react: { cache: fn => fn }, '@/lib/recruitment': helpers,
    '@/lib/content-api': { contentRequest: async (path, tags) => { assert.match(path, /locale=(nl|fr|en)$/); assert.deepEqual(tags, ['vacancies']); return { json: async () => ({ data: entries }) }; } },
  });
  for (const locale of ['nl', 'fr', 'en']) assert.deepEqual(await getVacancies(locale), [base]);
});

test('topbar and mobile jobs navigation, active detail state and badge are localized', () => {
  for (const locale of ['nl', 'fr', 'en']) {
    const messages = JSON.parse(fs.readFileSync(new URL(`../messages/${locale}.json`, import.meta.url)));
    const useTranslations = namespace => (key, values) => key === 'count' ? `${values.count} ${messages.Jobs.title}` : `${namespace}.${key}`.split('.').reduce((value, part) => value[part], messages);
    const badge = load('components/jobs/VacancyBadge.tsx', { 'next-intl': { useTranslations } }).default;
    assert.equal(badge({ count: 0 }), null);
    assert.ok(nodes(badge({ count: 2 })).some(n => n.props?.className === 'sr-only' && n.props.children.includes(messages.Jobs.title)));
    const mainNav = load('components/layout/HeaderNav.tsx', {
      'next-intl': { useTranslations }, '@/i18n/routing': { Link: 'a', usePathname: () => '/jobs' }, 'next/image': { default: 'image' },
    }).default;
    const mainLinks = nodes(mainNav({})).filter(n => n.type === 'a').map(n => n.props.href);
    assert.equal(mainLinks.includes('/jobs'), false);
    assert.deepEqual(mainLinks.filter(href => href !== '/services'), ['/projects', '/prices', '/knowledge']);
    for (const pathname of ['/jobs', '/jobs/[slug]', '/contact']) {
      for (const file of ['TopbarNav', 'MobileMenu']) {
        let open = false;
        const Component = load(`components/layout/${file}.tsx`, {
          react: { useState: () => [open, value => { open = value; }], useEffect: () => {} },
          'next-intl': { useTranslations }, '@/i18n/routing': { Link: 'a', usePathname: () => pathname },
          'next/image': { default: 'image' }, './LanguageSwitcher': { default: 'language' }, '@/components/jobs/VacancyBadge': { default: badge },
        }).default;
        if (file === 'MobileMenu') nodes(Component({ vacancyCount: 2 })).find(n => n.type === 'button').props.onClick();
        const tree = nodes(Component({ vacancyCount: 2 }));
        if (file === 'TopbarNav') assert.deepEqual(tree.filter(n => n.type === 'a').map(n => n.props.href), ['/areas', '/about', '/grants', '/jobs', '/faq', '/contact']);
        const links = tree.filter(n => n.props?.href === '/jobs');
        assert.equal(links.length, 1);
        assert.equal(links[0].props['aria-current'], pathname.startsWith('/jobs') ? 'page' : undefined);
        assert.ok(nodes(links[0]).some(n => n.props?.children === messages.Jobs.title || (Array.isArray(n.props?.children) && n.props.children.includes(messages.Jobs.title))));
        assert.equal(nodes(links[0]).find(n => n.type === badge).props.count, 2);
        const zeroTree = nodes(Component({ vacancyCount: 0 }));
        assert.equal(badge(nodes(zeroTree.find(n => n.props?.href === '/jobs')).find(n => n.type === badge).props), null);
        if (file === 'MobileMenu') { links[0].props.onClick(); assert.equal(nodes(Component({})).some(n => n.props?.href === '/jobs'), false); }
      }
    }
  }
});

test('empty overview offers a useful link; application has inline privacy link and masking', async () => {
  const page = load('app/[locale]/jobs/page.tsx', {
    'next-intl/server': { getTranslations: async () => key => key }, '@/i18n/routing': { Link: 'a' },
    '@/components/ui/Breadcrumbs': { default: 'breadcrumbs' }, '@/lib/vacancies': { getVacancies: async () => [] },
    '@/lib/recruitment': helpers, '@/lib/seo/metadata': { pageMetadata: () => ({}) }, 'next/image': { default: 'image' },
  }).default;
  const tree = nodes(await page({ params: Promise.resolve({ locale: 'nl' }), searchParams: Promise.resolve({}) }));
  assert.ok(tree.some(n => n.props?.children === 'empty'));
  assert.ok(tree.some(n => n.props?.href === '/about'));
  const h = harness(base); h.render();
  assert.ok(h.find(n => n.props?.href === '/privacy-policy'));
  assert.ok(h.find(n => n.props?.['data-clarity-mask'] === 'true'));
  assert.equal(h.find(n => n.type === 'progress').props.value, 1);
});


test('NL/FR/EN recruitment copy, rich privacy link and count messages resolve', () => {
  for (const locale of ['nl', 'fr', 'en']) {
    const messages = JSON.parse(fs.readFileSync(new URL(`../messages/${locale}.json`, import.meta.url)));
    const errors = [];
    const t = createTranslator({ locale, messages, namespace: 'Jobs', onError: error => errors.push(error) });
    for (const key of ['heroTitle', 'metaTitle', 'metaDescription', 'emptyDescription', 'otherJobs', 'application.profile', 'application.or', 'application.privacyTitle', 'application.successTitle', 'application.success', 'application.cvPrivacy']) assert.notEqual(t(key), `Jobs.${key}`);
    assert.match(t('count', { count: 2 }), /2/);
    assert.equal(typeof t.rich('application.privacy', { policy: chunks => chunks }), 'string');
    assert.deepEqual(errors, []);
    const policy = JSON.stringify(messages.LegalPages.privacy);
    assert.match(policy, /LinkedIn/);
    assert.match(policy, /UTM/);
  }
});
