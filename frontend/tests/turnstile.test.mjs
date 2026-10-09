import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);

function harness() {
  const slots = []; let cursor = 0; let pending = []; let tree;
  const tokens = []; const onToken = token => tokens.push(token);
  const code = ts.transpileModule(fs.readFileSync(new URL('../components/ui/Turnstile.tsx', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const hooks = {
    useRef: value => { const i = cursor++; return slots[i] ??= { current: value }; },
    useState: initial => { const i = cursor++; slots[i] ??= { value: initial }; return [slots[i].value, value => { slots[i].value = typeof value === 'function' ? value(slots[i].value) : value; }]; },
    useEffect: (effect, deps) => { const i = cursor++; const old = slots[i]; if (!old || deps.some((d, n) => d !== old.deps[n])) pending.push(() => { old?.cleanup?.(); slots[i] = { effect, deps, cleanup: effect() }; }); },
  };
  const loaded = { exports: {} };
  const mocks = { react: hooks, 'next/script': { default: 'script' }, 'next-intl': { useLocale: () => 'nl', useTranslations: () => key => key } };
  new Function('require', 'module', 'exports', 'process', code)(name => mocks[name] || require(name), loaded, loaded.exports, { env: { NEXT_PUBLIC_TURNSTILE_ENABLED: 'true', NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'test-site-key' } });
  function nodes(node) {
    if (!node || typeof node !== 'object') return [];
    if (Array.isArray(node)) return node.flatMap(nodes);
    return [node, ...nodes(node.props?.children)];
  }
  function render() {
    cursor = 0;
    tree = loaded.exports.default({ onToken });
    for (const node of nodes(tree)) if (node.props?.ref) node.props.ref.current ??= {};
    const effects = pending; pending = []; effects.forEach(run => run());
    return nodes(tree);
  }
  return {
    render, tokens,
    script: () => nodes(tree).find(n => n.type === 'script').props,
    unmount: () => slots.forEach(s => s?.cleanup?.()),
    strictReplay: () => { for (const s of slots) if (s?.effect) { s.cleanup?.(); s.cleanup = s.effect(); } },
  };
}

function fakeApi() {
  const options = []; const active = new Set(); let removed = 0;
  return {
    options, active, get removed() { return removed; },
    render(_container, config) { const id = String(options.length); options.push(config); active.add(id); return id; },
    remove(id) { active.delete(id); removed++; },
  };
}

test('delayed load, duplicate load events, callbacks, retry and late callbacks', () => {
  const old = global.window; global.window = {};
  try {
    const h = harness(); h.render();
    const api = fakeApi(); global.window.turnstile = api;
    h.script().onLoad(); h.script().onReady(); h.render();
    assert.equal(api.options.length, 1);
    api.options[0].callback('token'); assert.equal(h.tokens.at(-1), 'token');
    api.options[0]['expired-callback'](); assert.equal(h.tokens.at(-1), null);
    const button = h.render().find(n => n.type === 'button'); button.props.onClick(); h.render();
    assert.equal(api.options.length, 2); assert.equal(api.active.size, 1);
    api.options[1]['error-callback'](); assert.equal(h.tokens.at(-1), null);
    const script = h.script(); h.unmount(); const count = h.tokens.length;
    api.options[1].callback('late'); script.onLoad(); script.onError();
    assert.equal(h.tokens.length, count); assert.equal(api.active.size, 0);
  } finally { global.window = old; }
});

test('cached script renders immediately; Strict Mode and navigation keep one active widget', () => {
  const old = global.window; const api = fakeApi(); global.window = { turnstile: api };
  try {
    const h = harness(); h.render(); assert.equal(api.active.size, 1);
    h.strictReplay(); assert.equal(api.active.size, 1); assert.equal(api.removed, 1);
    h.script().onReady(); h.render(); assert.equal(api.options.length, 2);
    h.unmount();
    const next = harness(); next.render(); assert.equal(api.active.size, 1);
    next.script().onLoad(); next.script().onReady(); assert.equal(api.options.length, 3);
    next.unmount(); assert.equal(api.active.size, 0);
  } finally { global.window = old; }
});
