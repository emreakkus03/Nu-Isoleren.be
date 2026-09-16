import Image from 'next/image';
import { useTranslations } from 'next-intl';

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-7 h-7"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s6-5.373 6-11a6 6 0 1 0-12 0c0 5.627 6 11 6 11Z"
      />
      <circle cx="12" cy="10" r="2.25" />
    </svg>
  );
}

export default function ContactInfoCard() {
  const company = useTranslations('General.company');
  const person = useTranslations('General.contactPerson');

  return (
    <aside className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_15px_45px_rgba(15,23,42,0.08)]">
      <div className="px-6 sm:px-8 pt-8 sm:pt-10 pb-7 text-center">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full border-4 border-[#F1F5F9] overflow-hidden bg-gray-100">
          <Image
            src={person('image')}
            alt={person('name')}
            fill
            sizes="128px"
            className="object-cover"
          />
        </div>

        <h2 className="mt-5 text-2xl font-extrabold text-gray-950 tracking-tight">
          {person('name')}
        </h2>

        <h3 className="mt-3 text-lg sm:text-xl font-bold text-[#C82024] leading-snug">
          {person('title')}
        </h3>

        <p className="mt-5 text-base font-semibold text-gray-800">
          {person('intro')}
        </p>

        <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
          {person('description')}
        </p>
      </div>

      <div className="px-6 sm:px-8 pb-7">
        <div className="border-t border-gray-200">
          <a
            href={`tel:${company('phoneHref')}`}
            className="flex items-center gap-4 py-5 border-b border-gray-200 group"
          >
            <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-[#C82024] transition group-hover:bg-red-800">
              <Image
                src="/icons/phone.svg"
                alt=""
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
              />
            </span>

            <span className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#C82024] transition">
              {company('phone')}
            </span>
          </a>

          <a
            href={`mailto:${company('email')}`}
            className="flex items-center gap-4 py-5 border-b border-gray-200 group"
          >
            <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-[#C82024] transition group-hover:bg-red-800">
              <Image
                src="/icons/mail.svg"
                alt=""
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
              />
            </span>

            <span className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#C82024] transition break-all">
              {company('email')}
            </span>
          </a>

          <div className="flex items-start gap-4 py-5">
            <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-[#C82024] text-white">
              <LocationIcon />
            </span>

            <span className="pt-2 text-sm sm:text-base font-medium text-gray-700 leading-relaxed">
              {company('address')}
            </span>
          </div>
        </div>

        <div className="mt-2 rounded-xl bg-[#F7F9FA] px-5 py-5 text-center">
          <p className="text-sm font-extrabold text-gray-900">
            {company('name')}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {company('address')}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {company('phone')}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {company('email')}
          </p>

          <p className="mt-3 text-sm font-medium text-gray-700">
            BTW: {company('vat')}
          </p>
        </div>
      </div>
    </aside>
  );
}