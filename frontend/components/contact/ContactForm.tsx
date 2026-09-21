'use client';

import { FormEvent, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  privacy_accepted: boolean;
}

const initialFormData: ContactFormData = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  message: '',
  privacy_accepted: false,
};

export default function ContactForm() {
  const t = useTranslations('ContactPage.form');
  const locale = useLocale();

  const [formData, setFormData] =
    useState<ContactFormData>(initialFormData);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [status, setStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const handleChange = (
    field: keyof ContactFormData,
    value: string | boolean,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    if (status !== 'idle') {
      setStatus('idle');
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!formData.privacy_accepted) {
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error(
          'NEXT_PUBLIC_API_URL ontbreekt.',
        );
      }

      const response = await fetch(
        `${apiUrl.replace(/\/$/, '')}/contact-submissions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            locale,
            source: 'contact_page',
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          'Contactaanvraag kon niet worden verzonden.',
        );
      }

      setFormData(initialFormData);
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    'w-full h-12 rounded-xl border border-gray-300 bg-white px-4 text-base text-gray-950 outline-none transition focus:border-[#1A669A] focus:ring-2 focus:ring-[#1A669A]/10 placeholder:text-gray-400';

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="first_name"
            className="text-sm font-bold text-gray-900"
          >
            {t('fields.firstName')}
          </label>

          <input
            id="first_name"
            name="first_name"
            type="text"
            required
            autoComplete="given-name"
            value={formData.first_name}
            onChange={(event) =>
              handleChange(
                'first_name',
                event.target.value,
              )
            }
            className={inputClasses}
            placeholder={t(
              'placeholders.firstName',
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="last_name"
            className="text-sm font-bold text-gray-900"
          >
            {t('fields.lastName')}
          </label>

          <input
            id="last_name"
            name="last_name"
            type="text"
            required
            autoComplete="family-name"
            value={formData.last_name}
            onChange={(event) =>
              handleChange(
                'last_name',
                event.target.value,
              )
            }
            className={inputClasses}
            placeholder={t(
              'placeholders.lastName',
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-sm font-bold text-gray-900"
          >
            {t('fields.email')}
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={(event) =>
              handleChange(
                'email',
                event.target.value,
              )
            }
            className={inputClasses}
            placeholder={t(
              'placeholders.email',
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="phone"
            className="text-sm font-bold text-gray-900"
          >
            {t('fields.phone')}
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={formData.phone}
            onChange={(event) =>
              handleChange(
                'phone',
                event.target.value,
              )
            }
            className={inputClasses}
            placeholder={t(
              'placeholders.phone',
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="message"
          className="text-sm font-bold text-gray-900"
        >
          {t('fields.message')}
        </label>

        <textarea
          id="message"
          name="message"
          required
          rows={7}
          value={formData.message}
          onChange={(event) =>
            handleChange(
              'message',
              event.target.value,
            )
          }
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-950 outline-none transition resize-y focus:border-[#1A669A] focus:ring-2 focus:ring-[#1A669A]/10 placeholder:text-gray-400"
          placeholder={t(
            'placeholders.message',
          )}
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          required
          checked={
            formData.privacy_accepted
          }
          onChange={(event) =>
            handleChange(
              'privacy_accepted',
              event.target.checked,
            )
          }
          className="mt-1 h-4 w-4 shrink-0 accent-[#C82024] cursor-pointer"
        />

        <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          {t('privacyPrefix')}{' '}
          <Link
            href="/privacy-policy"
            className="font-semibold text-[#1A669A] underline underline-offset-2 hover:text-[#C82024] transition"
          >
            {t('privacyLink')}
          </Link>
          .
        </span>
      </label>

      <div className="pt-2">
        <button
          type="submit"
          disabled={
            isSubmitting ||
            !formData.privacy_accepted
          }
          className="inline-flex items-center justify-center gap-2 bg-[#C82024] hover:bg-red-800 text-white text-base md:text-lg font-bold px-6 py-3 lg:px-7 lg:py-3.5 rounded-full transition shadow-lg hover:shadow-xl transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#C82024] disabled:hover:shadow-lg cursor-pointer"
        >
          {isSubmitting
            ? t('submitting')
            : t('submit')}

          {!isSubmitting && (
            <span
              aria-hidden="true"
              className="text-lg"
            >
              →
            </span>
          )}
        </button>
      </div>

      {status === 'success' && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
          {t('success')}
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {t('error')}
        </div>
      )}
    </form>
  );
}