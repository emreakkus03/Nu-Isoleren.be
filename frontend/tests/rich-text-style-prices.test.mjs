import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import postcss from 'postcss';
const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const loaded = { exports: {} };
  const source = fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  new Function('require', 'module', 'exports', code)(name => mocks[name] ?? require(name), loaded, loaded.exports);
  return loaded.exports;
}
const RichText = load('components/ui/RichTextContent.tsx', { './RichTextContent.module.css': { default: { content: 'cms-rich-text' } } }).default;
const css = postcss.parse(fs.readFileSync(new URL('../components/ui/RichTextContent.module.css', import.meta.url), 'utf8'));
function declarations(selector) {
  const values = {};
  css.walkRules(selector, rule => rule.walkDecls(decl => { values[decl.prop] = { value: decl.value, important: Boolean(decl.important) }; }));
  return values;
}
test('one scoped link style has branded blue normal state, red hover/focus and nested inheritance', () => {
  assert.equal(declarations('.content')['--cms-link-color'].value, '#1A669A');
  assert.equal(declarations('.content')['--cms-link-active-color'].value, '#C82024');
  assert.deepEqual(declarations('.content a').color, { value: 'var(--cms-link-color)', important: true });
  assert.equal(declarations('.content a')['text-decoration-line'].value, 'underline');
  assert.equal(declarations('.content a')['text-decoration-color'].value, 'currentColor');
  assert.deepEqual(declarations('.content a:hover,\n.content a:focus').color, { value: 'var(--cms-link-active-color)', important: true });
  assert.deepEqual(declarations('.content a *').color, { value: 'inherit', important: true });
  assert.equal(declarations('.content a *')['text-decoration-color'].value, 'currentColor');
  assert.ok(declarations('.content a:focus-visible').outline);
});
test('nested strong/italic links and all saved HTML marks retain semantic markup and shared styles', () => {
  const content = '<p><strong><a href="/nl/gratis-offerte">One</a></strong> <a href="/nl/gratis-offerte"><strong>Two</strong></a> <em><a href="/nl/gratis-offerte">Three</a></em> <a href="/nl/gratis-offerte"><em style="color:black">Four</em></a><br><u>Underlined</u><s>Strike</s><sub>2</sub><sup>3</sup></p><h2>Heading</h2><h3>Subheading</h3><ul><li>Bullet</li></ul><ol><li>Number</li></ol><blockquote>Quote</blockquote><pre><code>Code</code></pre><p style="text-align:center">Aligned</p><table><thead><tr><th>Name</th></tr></thead><tbody><tr><td>Cell</td></tr></tbody></table>';
  const tree = RichText({ html: content, className: 'mb-6' });
  assert.equal(tree.props.dangerouslySetInnerHTML.__html, content);
  const rendered = renderToStaticMarkup(createElement(RichText, { html: content }));
  assert.ok(rendered.endsWith(content + '</div>'));
  const classes = tree.props.className;
  for (const expected of ['cms-rich-text', '[&_ul]:list-disc', '[&_ol]:list-decimal', '[&_li::marker]:text-[#C82024]', '[&_h2]:text-xl', 'sm:[&_h2]:text-2xl', 'md:[&_h2]:text-3xl', '[&_h3]:font-extrabold', '[&_u]:underline', '[&_s]:line-through', '[&_sub]:align-sub', '[&_sup]:align-super', 'max-md:[&_table]:overflow-x-auto', 'max-md:[&_table]:max-w-full', '[&_td]:border', '[&_th]:px-4', '[overflow-wrap:anywhere]', 'mb-6']) assert.ok(classes.includes(expected), expected);
});
test('services, knowledge and projects use the same renderer without changing service section layout or localization', () => {
  const service = fs.readFileSync(new URL('../app/[locale]/services/[slug]/page.tsx', import.meta.url), 'utf8');
  const knowledge = fs.readFileSync(new URL('../components/knowledge/detail/KnowledgeArticleContent.tsx', import.meta.url), 'utf8');
  const project = fs.readFileSync(new URL('../app/[locale]/projects/[slug]/page.tsx', import.meta.url), 'utf8');
  for (const page of [service, knowledge, project]) assert.ok(page.includes("import RichTextContent from '@/components/ui/RichTextContent'"));
  assert.equal((service.match(/<RichTextContent/g) ?? []).length, 5);
  assert.ok(service.includes('formatIntroParagraphs('));
  assert.ok(service.includes('html={localizeRichTextHtml(section.body, locale)}'));
  assert.ok(service.includes('py-10 sm:py-14'));
  assert.ok(project.includes('<RichTextContent html={project.description} />'));
  assert.ok(knowledge.includes('<RichTextContent html={section.body} className="mb-6" />'));
  const classes = RichText({ html: '' }).props.className;
  for (const baseline of ['text-sm sm:text-base', 'text-black leading-relaxed', '[&_p]:mb-4', '[&_p:last-child]:mb-0', '[&_strong]:font-bold', '[&_ul]:my-5', '[&_ol]:my-5', '[&_li]:my-1', '[&_a]:font-extrabold']) assert.ok(classes.includes(baseline));
});
for (const [locale, suffix] of [['nl', 'excl. btw'], ['fr', 'hors TVA'], ['en', 'excl. VAT']]) {
  test(`all seven price fields in ${locale} show VAT exclusion without changing amounts`, () => {
    const messages = JSON.parse(fs.readFileSync(new URL('../messages/' + locale + '.json', import.meta.url))).PricesPage;
    const fields = [messages.tools.price.description, messages.servicePrices.description, messages.servicePrices.cavityWall.price, messages.methodology.items.ranges.description, messages.examples.description, messages.examples.cavityWall.price, messages.examples.cavityWall.calculation];
    for (const text of fields) assert.ok(text.includes(suffix), text);
    assert.equal(messages.examples.description.split(suffix).length - 1, 2);
    for (const text of fields.filter(text => text.includes('21'))) assert.match(text, /21.*25.*m²/);
    assert.ok(messages.examples.cavityWall.price.includes(locale === 'en' ? '2,100' : '2.100'));
    assert.ok(messages.examples.cavityWall.price.includes(locale === 'en' ? '2,500' : '2.500'));
    assert.match(messages.examples.cavityWall.calculation, /^100 m² ×/);
    const walk = value => typeof value === 'string' ? [value] : value && typeof value === 'object' ? Object.values(value).flatMap(walk) : [];
    const prices = walk(messages).filter(text => /21.*25/.test(text) || /2[., ]100/.test(text));
    assert.equal(prices.length, 7);
    assert.ok(prices.every(text => text.includes(suffix)));
  });
}
