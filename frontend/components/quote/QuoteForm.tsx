'use client';

import { FormEvent, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';

interface Service {
  id: number;
  name: string;
}

interface QuoteFormProps {
  services: Service[];
  locale: string;
  apiUrl: string;
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street: string;
  house_number: string;
  postcode: string;
  city: string;
  message: string;
  privacy_consent: boolean;
}

const initialFormData: FormData = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  street: '',
  house_number: '',
  postcode: '',
  city: '',
  message: '',
  privacy_consent: false,
};

interface QuoteFormProps {
  services: Service[];
  locale: string;
  apiUrl: string;
  initialServiceIds?: number[];
}



export default function QuoteForm({
  services,
  locale,
  apiUrl,
  initialServiceIds = [],
}: QuoteFormProps) {
  const router = useRouter();
  const submissionLocked = useRef(false);
  const t = useTranslations('QuotePage.form');

 const [step, setStep] = useState(initialServiceIds.length > 0 ? 2 : 1);

const [selectedServices, setSelectedServices] = useState<number[]>(
  initialServiceIds,
);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleService = (id: number) => {
    setSelectedServices((current) =>
      current.includes(id)
        ? current.filter((serviceId) => serviceId !== id)
        : [...current, id],
    );

    setError(null);
  };

  const updateField = (
    field: keyof FormData,
    value: string | boolean,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setError(null);
  };

  const goToContactStep = () => {
    if (selectedServices.length === 0) {
      setError(t('errors.service'));
      return;
    }

    setError(null);
    setStep(2);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (submissionLocked.current) return;

    if (!formData.privacy_consent) {
      setError(t('errors.privacy'));
      return;
    }

    submissionLocked.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `${apiUrl}/quote-requests`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_ids: selectedServices,
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone: formData.phone,
            street: formData.street,
            house_number: formData.house_number,
            postcode: formData.postcode,
            city: formData.city,
            message: formData.message || null,
            locale,
            privacy_consent: formData.privacy_consent,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || data.success !== true) {
        throw new Error(
          data.message ?? 'Quote request failed',
        );
      }

      router.replace('/thank-you/quote');
    } catch {
      setError(t('errors.submit'));
      submissionLocked.current = false;
      setIsSubmitting(false);
    }
  };


  return (
    <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-7 md:p-9 shadow-xl shadow-gray-200/50 border border-gray-100">
      <div className="flex items-center justify-between gap-4">
        <span className="text-xs sm:text-sm font-bold text-[#1A669A]">
          {t('step', {
            current: step,
            total: 2,
          })}
        </span>

        <span className="text-xs sm:text-sm font-semibold text-gray-400">
          {step}/2
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="h-1.5 rounded-full bg-[#1A669A]" />

        <div
          className={`h-1.5 rounded-full transition ${
            step === 2
              ? 'bg-[#1A669A]'
              : 'bg-gray-200'
          }`}
        />
      </div>

      {step === 1 && (
        <div className="mt-7">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              {t('services.title')}
            </h2>

            <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-500 leading-relaxed">
              {t('services.description')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mt-7">
            {services.map((service) => {
              const isSelected =
                selectedServices.includes(service.id);

              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() =>
                    toggleService(service.id)
                  }
                  className={`py-2.5 px-2 sm:px-3 rounded-full text-xs md:text-sm lg:text-base font-semibold transition text-center border leading-tight max-md:[overflow-wrap:anywhere] flex items-center justify-center min-h-[44px] cursor-pointer ${
                    isSelected
                      ? 'border-[#1A669A] bg-sky-50 text-sky-950 font-bold shadow-sm'
                      : 'border-gray-200 bg-gray-50/60 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                  }`}
                >
                  <span>{service.name}</span>
                </button>
              );
            })}
          </div>

          {error && (
            <p className="mt-5 text-sm font-semibold text-[#C82024] text-center">
              {error}
            </p>
          )}

          <div className="flex justify-center mt-7">
            <button
              type="button"
              onClick={goToContactStep}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#C82024] hover:bg-red-800 text-white font-bold text-sm sm:text-base px-7 py-3 rounded-full cursor-pointer whitespace-nowrap max-md:whitespace-normal max-md:[overflow-wrap:anywhere] transition shadow-sm hover:shadow-md active:scale-95 group"
            >
              <span>{t('buttons.next')}</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form
          onSubmit={handleSubmit}
          className="mt-7"
        >
          <div className="text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              {t('contact.title')}
            </h2>

            <p className="mt-2 text-xs sm:text-sm md:text-base text-gray-500 leading-relaxed">
              {t('contact.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">
            <Input
              label={t('fields.firstName')}
              value={formData.first_name}
              onChange={(value) =>
                updateField('first_name', value)
              }
              required
            />

            <Input
              label={t('fields.lastName')}
              value={formData.last_name}
              onChange={(value) =>
                updateField('last_name', value)
              }
              required
            />

            <Input
              type="email"
              label={t('fields.email')}
              value={formData.email}
              onChange={(value) =>
                updateField('email', value)
              }
              required
            />

            <Input
              type="tel"
              label={t('fields.phone')}
              value={formData.phone}
              onChange={(value) =>
                updateField('phone', value)
              }
              required
            />

            <div className="sm:col-span-2 grid grid-cols-[1fr_90px] sm:grid-cols-[1fr_110px] gap-3">
              <Input
                label={t('fields.street')}
                value={formData.street}
                onChange={(value) =>
                  updateField('street', value)
                }
                required
              />

              <Input
                label={t('fields.houseNumber')}
                value={formData.house_number}
                onChange={(value) =>
                  updateField('house_number', value)
                }
                required
              />
            </div>

            <Input
              label={t('fields.postcode')}
              value={formData.postcode}
              onChange={(value) =>
                updateField('postcode', value)
              }
              required
            />

            <Input
              label={t('fields.city')}
              value={formData.city}
              onChange={(value) =>
                updateField('city', value)
              }
              required
            />

            <div className="sm:col-span-2 mt-1">
              <label className="block mb-2 text-xs sm:text-sm font-semibold text-gray-800">
                {t('fields.message')}
              </label>

              <textarea
                rows={4}
                value={formData.message}
                onChange={(event) =>
                  updateField(
                    'message',
                    event.target.value,
                  )
                }
                placeholder={t(
                  'fields.messagePlaceholder',
                )}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-base text-gray-950 placeholder:text-gray-400 outline-none transition resize-none focus:bg-white focus:border-[#1A669A] focus:ring-2 focus:ring-[#1A669A]/10"
              />
            </div>
          </div>

          <label className="flex items-start gap-3 mt-5 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.privacy_consent}
              onChange={(event) =>
                updateField(
                  'privacy_consent',
                  event.target.checked,
                )
              }
              className="mt-1 h-4 w-4 shrink-0 accent-[#C82024] cursor-pointer"
            />

            <span className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              <Link href="/privacy-policy" className="underline">{t('privacy')}</Link>
            </span>
          </label>

          {error && (
            <p className="mt-5 text-sm font-semibold text-[#C82024] text-center">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 mt-7">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep(1);
              }}
              className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-gray-50/60 hover:bg-gray-100 text-gray-700 font-bold text-sm px-5 py-3 rounded-full transition cursor-pointer"
            >
              <span>{t('buttons.back')}</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2.5 bg-[#C82024] hover:bg-red-800 text-white font-bold text-sm sm:text-base px-6 py-3 rounded-full cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap max-md:whitespace-normal max-md:[overflow-wrap:anywhere] transition shadow-sm hover:shadow-md active:scale-95 group"
            >
              <span>
                {isSubmitting
                  ? t('buttons.submitting')
                  : t('buttons.submit')}
              </span>

              {!isSubmitting && (
                 <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: InputProps) {
  return (
    <div>
      <label className="block mb-2 text-xs sm:text-sm font-semibold text-gray-800">
        {label}

        {required && (
          <span className="text-[#C82024]"> *</span>
        )}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        required={required}
        className="min-w-0 w-full rounded-full border border-gray-200 bg-gray-50/60 px-4 py-3 text-base text-gray-950 outline-none transition focus:bg-white focus:border-[#1A669A] focus:ring-2 focus:ring-[#1A669A]/10"
      />
    </div>
  );
}