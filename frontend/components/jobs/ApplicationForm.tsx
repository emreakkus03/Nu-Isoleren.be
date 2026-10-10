'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Turnstile, { turnstileEnabled } from '@/components/ui/Turnstile';
import { validAnswer, validCv, validLinkedIn } from '@/lib/recruitment';
import type { Answer, Vacancy } from '@/types/vacancy';

const inputClass = 'mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-[#1A669A] focus:outline-2 focus:outline-[#1A669A]';
const buttonClass = 'rounded-lg bg-[#C82024] px-6 py-3 font-bold text-white disabled:opacity-50';

export default function ApplicationForm({ vacancy, source }: { vacancy: Vacancy; source: Record<string, string> }) {
  const t = useTranslations('Jobs.application');
  const locale = useLocale();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [person, setPerson] = useState({ first_name: '', last_name: '', email: '', phone: '', city: '', linkedin_url: '' });
  const [cv, setCv] = useState<File | null>(null);
  const [privacy, setPrivacy] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<'success' | 'mail-failed' | null>(null);
  const locked = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);
  const final = step === vacancy.questions.length;
  const question = vacancy.questions[step];
  const total = vacancy.questions.length + 1;

  useEffect(() => {
    if (step !== previousStep.current) heading.current?.focus();
    previousStep.current = step;
  }, [step]);

  function changeAnswer(value: Answer) {
    setAnswers(current => ({ ...current, [question.id]: value }));
    setError(null);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    if (!final) {
      if (!validAnswer(question, answers[question.id])) { setError(t('answerError')); return; }
      setError(null); setStep(current => current + 1); return;
    }
    if (vacancy.require_cv_or_linkedin && !cv && !person.linkedin_url.trim()) { setError(t('cvRequired')); return; }
    if (person.linkedin_url.trim() && !validLinkedIn(person.linkedin_url.trim())) { setError(t('linkedinError')); return; }
    if (cv && !validCv(cv, vacancy.max_cv_mb)) { setError(t('cvError', { max: vacancy.max_cv_mb })); return; }
    if (!privacy || (turnstileEnabled && !token)) { setError(t('checkRequired')); return; }
    const invalid = vacancy.questions.findIndex(item => !validAnswer(item, answers[item.id]));
    if (invalid >= 0) { setStep(invalid); setError(t('answerError')); return; }
    locked.current = true; setBusy(true); setError(null);
    const body = new FormData();
    Object.entries(person).forEach(([key, value]) => body.set(key, value.trim()));
    Object.entries(source).forEach(([key, value]) => body.set(key, value));
    body.set('locale', locale); body.set('privacy_accepted', '1'); body.set('answers', JSON.stringify(answers));
    if (cv) body.set('cv', cv);
    if (turnstileEnabled && token) body.set('turnstile_token', token);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error('API unavailable');
      const response = await fetch(`${apiUrl.replace(/\/$/, '')}/vacancies/${vacancy.id}/applications`, { method: 'POST', headers: { Accept: 'application/json' }, body });
      const data = await response.json();
      if (response.ok && data.success === true) {
        setResult('success'); setCv(null); return;
      }
      if (data.recorded === true) {
        setResult('mail-failed'); setCv(null); return;
      }
      const invalidQuestion = Object.keys(data.errors ?? {}).find(key => key.startsWith('answers.'));
      if (invalidQuestion) {
        const index = vacancy.questions.findIndex(item => item.id === Number(invalidQuestion.split('.')[1]));
        if (index >= 0) setStep(index);
      }
      setError(response.status === 422 ? t('validationError') : t('submitError'));
    } catch {
      setError(t('submitError'));
    } finally {
      setBusy(false); locked.current = false; setToken(null); setAttempt(current => current + 1);
    }
  }

  if (result) return <section id="application" className="max-w-3xl scroll-mt-28 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8" role="status">
    <h2 className="text-2xl font-extrabold">{t(result === 'success' ? 'successTitle' : 'mailFailedTitle')}</h2>
    <p className="mt-4 leading-7">{t(result === 'success' ? 'success' : 'mailFailed')}</p>
    {result === 'mail-failed' && <Link href="/contact" className="mt-4 inline-block font-bold text-[#1A669A] underline">{t('contact')}</Link>}
  </section>;

  return <section id="application" className="max-w-3xl scroll-mt-28 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-8">
    <h2 ref={heading} tabIndex={-1} className="text-2xl font-extrabold text-slate-900 outline-none max-md:text-center">{t('title')}</h2>
    <p className="mt-3 text-sm font-bold text-[#1A669A]" aria-live="polite">{t('step', { current: step + 1, total })}</p>
    <progress className="mt-3 h-2 w-full accent-[#1A669A]" value={step + 1} max={total} aria-label={t('progress')} />
    <form onSubmit={submit} className="mt-6 space-y-5">
      <fieldset disabled={busy} className="min-w-0 space-y-5">
        {!final ? <>
          <legend className="text-lg font-bold text-slate-900">{question.question} {question.required ? '*' : `(${t('optional')})`}</legend>
          {question.help_text && <p id="question-help" className="text-sm leading-6 text-slate-600">{question.help_text}</p>}
          {question.type === 'yes_no' && [true, false].map(value => <label key={String(value)} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
            <input type="radio" name={`question-${question.id}`} checked={answers[question.id] === value} onChange={() => changeAnswer(value)} />{t(value ? 'yes' : 'no')}
          </label>)}
          {(question.type === 'single_choice' || question.type === 'multiple_choice') && question.options.map(option => {
            const current = answers[question.id];
            const selected = Array.isArray(current) ? current : [];
            return <label key={option.value} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
              <input type={question.type === 'single_choice' ? 'radio' : 'checkbox'} name={`question-${question.id}`} checked={question.type === 'single_choice' ? current === option.value : selected.includes(option.value)} onChange={event => changeAnswer(question.type === 'single_choice' ? option.value : event.target.checked ? [...selected, option.value] : selected.filter(value => value !== option.value))} />{option.label}
            </label>;
          })}
          {(question.type === 'short_text' || question.type === 'long_text') && <label className="block"><span className="sr-only">{question.question}</span>
            {question.type === 'long_text' ? <textarea className={inputClass} rows={5} maxLength={5000} value={String(answers[question.id] ?? '')} onChange={event => changeAnswer(event.target.value)} aria-describedby={question.help_text ? 'question-help' : undefined} /> : <input className={inputClass} maxLength={500} value={String(answers[question.id] ?? '')} onChange={event => changeAnswer(event.target.value)} aria-describedby={question.help_text ? 'question-help' : undefined} />}
          </label>}
          {!question.required && answers[question.id] !== undefined && <button type="button" className="text-sm text-[#1A669A] underline" onClick={() => setAnswers(current => { const next = { ...current }; delete next[question.id]; return next; })}>{t('clear')}</button>}
        </> : <>
          <legend className="text-lg font-bold">{t('details')}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            {(['first_name', 'last_name', 'email', 'phone', 'city'] as const).map(field => <label key={field} className="block text-sm font-semibold">{t(field)} *<input className={inputClass} type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'} required maxLength={field === 'phone' ? 50 : field === 'email' || field === 'city' ? 255 : 100} autoComplete={{ first_name: 'given-name', last_name: 'family-name', email: 'email', phone: 'tel', city: 'address-level2' }[field]} value={person[field]} onChange={event => setPerson(current => ({ ...current, [field]: event.target.value }))} /></label>)}
          </div>
          <p className="text-sm text-slate-600">{t(vacancy.require_cv_or_linkedin ? 'cvInstruction' : 'cvOptional', { max: vacancy.max_cv_mb })}</p>
          <label className="block text-sm font-semibold">{t('cv')}<input type="file" accept=".pdf,application/pdf" className={inputClass} onChange={event => { setCv(event.target.files?.[0] ?? null); setError(null); }} />{cv && <span className="mt-2 block font-normal">{cv.name}</span>}</label>
          <label className="block text-sm font-semibold">{t('linkedin')}<input type="url" className={inputClass} maxLength={500} value={person.linkedin_url} onChange={event => setPerson(current => ({ ...current, linkedin_url: event.target.value }))} /></label>
          <p className="text-sm text-slate-600">{t('cvPrivacy')}</p>
          <label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" className="mt-1" required checked={privacy} onChange={event => setPrivacy(event.target.checked)} /><span>{t('privacy')} <Link href="/privacy-policy" target="_blank" className="font-bold text-[#1A669A] underline">{t('privacyLink')}</Link></span></label>
          <Turnstile key={attempt} onToken={setToken} />
        </>}
      </fieldset>
      {error && <p role="alert" className="text-sm font-semibold text-red-800">{error}</p>}
      <div className="flex flex-wrap justify-between gap-3">
        {step > 0 && <button type="button" disabled={busy} className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold disabled:opacity-50" onClick={() => { setError(null); setToken(null); setStep(current => current - 1); }}>{t('previous')}</button>}
        <button type="submit" disabled={busy || (final && turnstileEnabled && !token)} className={buttonClass}>{t(busy ? 'sending' : final ? 'submit' : 'next')}</button>
      </div>
    </form>
  </section>;
}
