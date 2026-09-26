import fs from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const loadModule = createRequire(import.meta.url);
import os from 'node:os';
import path from 'node:path';
import ts from 'typescript';
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'nu-consent-'));
for (const name of ['consent', 'google-consent', 'consent-store', 'gtm']) {
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
 const google=window.dataLayer.filter(entry => entry[0] === 'consent').at(-1)[2];assert.equal(google.analytics_storage,analytics?'granted':'denied');assert.equal(google.ad_storage,marketing?'granted':'denied');assert.equal(google.ad_user_data,google.ad_storage);assert.equal(google.ad_personalization,google.ad_storage);
 const event=window.dataLayer.filter(entry=>entry.event==='nu_consent_update').at(-1);assert.equal(event.consent_analytics,analytics);assert.equal(event.consent_marketing,marketing);
 stop();stop=store.initializeConsent();assert.equal(store.getConsentSnapshot().consent.analytics,analytics);
}
store.openConsentPreferences();assert.equal(store.getConsentSnapshot().panelOpen,true);store.closeConsentPreferences();
const {CONSENT_STORAGE_KEY}=loadModule(path.join(directory, 'consent.js'));storage.set(CONSENT_STORAGE_KEY,'invalid');events.storage({key:CONSENT_STORAGE_KEY});assert.equal(store.getConsentSnapshot().consent,null);assert.equal(store.getConsentSnapshot().preferences.analytics,false);
localStorage.setItem=()=>{throw Error('blocked')};store.saveConsent({...DEFAULT_CONSENT,analytics:true});assert.equal(store.getConsentSnapshot().storageFailed,true);assert.equal(store.getConsentSnapshot().preferences.analytics,true);assert(changes>5);
stop();unsubscribe();console.log('PASS: invalid/expired/versioned preferences, all four category combinations, persistence, Google default/update ordering, cross-tab invalidation, storage failures, panel state.');

const {validGtmId}=loadModule(path.join(directory,'gtm.js'));
assert.equal(validGtmId(undefined),null);assert.equal(validGtmId(''),null);assert.equal(validGtmId('bad'),null);assert.equal(validGtmId('GTM-P6K3L9WQ'),'GTM-P6K3L9WQ');

const {runInNewContext}=await import('node:vm');
let ready=false;
const componentModule={exports:{}};
const componentSource=fs.readFileSync(fileURLToPath(new URL('../components/cookie/GoogleTagManager.tsx',import.meta.url)),'utf8');
const componentCode=ts.transpileModule(componentSource,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX}}).outputText;
runInNewContext(componentCode,{exports:componentModule.exports,require:name=>name==='./useConsent'?{useConsent:()=>({ready})}:name==='next/script'?{default:'script'}:loadModule(name)});
const GoogleTagManager=componentModule.exports.default;
assert.equal(GoogleTagManager({id:'GTM-P6K3L9WQ'}),null);
stop();
for(const name of ['consent-store','google-consent']) delete loadModule.cache[loadModule.resolve(path.join(directory,name+'.js'))];
storage.set(CONSENT_STORAGE_KEY,JSON.stringify(createConsent({necessary:true,analytics:true,marketing:false})));
window.dataLayer=[];delete window.gtag;
const reloadedStore=loadModule(path.join(directory,'consent-store.js'));
const stopReload=reloadedStore.initializeConsent();
assert.equal(window.dataLayer[0][1],'default');assert.equal(window.dataLayer[0][2].analytics_storage,'denied');
assert.equal(window.dataLayer[1][1],'update');assert.equal(window.dataLayer[1][2].analytics_storage,'granted');assert.equal(window.dataLayer[1][2].ad_storage,'denied');
ready=reloadedStore.getConsentSnapshot().ready;
let inserted=false;
const scriptElement=GoogleTagManager({id:'GTM-P6K3L9WQ'});
runInNewContext(scriptElement.props.children,{window,document:{createElement:()=>({}),getElementsByTagName:()=>[{parentNode:{insertBefore:script=>{assert.equal(script.src,'https://www.googletagmanager.com/gtm.js?id=GTM-P6K3L9WQ');assert.equal(window.dataLayer[0][1],'default');assert.equal(window.dataLayer[1][1],'update');assert.equal(window.dataLayer.at(-1).event,'gtm.js');inserted=true;}}}]}});
assert.equal(inserted,true);stopReload();
console.log('PASS: GTM waits for initialized store, fresh reload queues denied then saved consent before GTM insertion; missing/invalid GTM IDs disabled.');
