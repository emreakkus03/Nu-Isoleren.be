import fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const loadModule = createRequire(import.meta.url);
import os from 'node:os';
import path from 'node:path';
import ts from 'typescript';
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'nu-consent-'));
for (const name of ['consent', 'google-consent', 'consent-store']) {
  const input = fs.readFileSync(fileURLToPath(new URL('../lib/' + name + '.ts', import.meta.url)), 'utf8');
  fs.writeFileSync(path.join(directory, name + '.js'), ts.transpileModule(input, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText);
}
process.on('exit', () => fs.rmSync(directory, { recursive: true, force: true }));
import assert from 'node:assert/strict';
const {parseConsent, createConsent, DEFAULT_CONSENT, CONSENT_MAX_AGE} = loadModule(path.join(directory, 'consent.js'));
const now=Date.now();
for(const value of [null,'bad','null','[]','{}',JSON.stringify({...createConsent(DEFAULT_CONSENT,now),version:0}),JSON.stringify(createConsent(DEFAULT_CONSENT,now-CONSENT_MAX_AGE)),JSON.stringify({...createConsent(DEFAULT_CONSENT,now),analytics:'yes'}),JSON.stringify({...createConsent(DEFAULT_CONSENT,now),necessary:false})]) assert.equal(parseConsent(value,now),null);
assert.equal(parseConsent(JSON.stringify(createConsent(DEFAULT_CONSENT,now+1)),now),null);
const events={};global.window={addEventListener:(k,v)=>events[k]=v,removeEventListener:()=>{}};global.document={visibilityState:'visible',addEventListener:()=>{},removeEventListener:()=>{}};
const storage=new Map();global.localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)};
const store=loadModule(path.join(directory, 'consent-store.js'));let changes=0;const unsubscribe=store.subscribeConsent(()=>changes++);let stop=store.initializeConsent();
assert.equal(store.getConsentSnapshot().ready,true);assert.equal(store.getConsentSnapshot().consent,null);
assert.equal(window.dataLayer[0][1],'default');assert.deepEqual(Object.values(window.dataLayer[0][2]),['denied','denied','denied','denied']);
for(const [analytics,marketing] of [[false,false],[true,true],[true,false],[false,true]]) {
 store.saveConsent({necessary:true,analytics,marketing});const snapshot=store.getConsentSnapshot();assert.equal(snapshot.consent.analytics,analytics);assert.equal(snapshot.consent.marketing,marketing);assert.equal(snapshot.panelOpen,false);
 const google=window.dataLayer.at(-1)[2];assert.equal(google.analytics_storage,analytics?'granted':'denied');assert.equal(google.ad_storage,marketing?'granted':'denied');assert.equal(google.ad_user_data,google.ad_storage);assert.equal(google.ad_personalization,google.ad_storage);
 stop();stop=store.initializeConsent();assert.equal(store.getConsentSnapshot().consent.analytics,analytics);
}
store.openConsentPreferences();assert.equal(store.getConsentSnapshot().panelOpen,true);store.closeConsentPreferences();
const {CONSENT_STORAGE_KEY}=loadModule(path.join(directory, 'consent.js'));storage.set(CONSENT_STORAGE_KEY,'invalid');events.storage({key:CONSENT_STORAGE_KEY});assert.equal(store.getConsentSnapshot().consent,null);assert.equal(store.getConsentSnapshot().preferences.analytics,false);
localStorage.setItem=()=>{throw Error('blocked')};store.saveConsent({...DEFAULT_CONSENT,analytics:true});assert.equal(store.getConsentSnapshot().storageFailed,true);assert.equal(store.getConsentSnapshot().preferences.analytics,true);assert(changes>5);
stop();unsubscribe();console.log('PASS: invalid/expired/versioned preferences, all four category combinations, persistence, Google default/update ordering, cross-tab invalidation, storage failures, panel state.');
