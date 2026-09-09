import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function FloatingButtons() {
  const t = useTranslations('Floating');

  return (
    <div className="hidden md:flex fixed right-0 top-1/3 z-50 flex-col items-end gap-2 pointer-events-none">
      
      <a 
        href="tel:+32400000000" 
        className="group/phone pointer-events-auto flex items-center bg-[#C82024] hover:bg-red-800 text-white p-3 rounded-l-md shadow-lg transition-colors duration-300"
      >
        <Image src="/icons/phone.svg" alt="Telefoon" width={24} height={24} className="shrink-0" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in-out group-hover/phone:max-w-[320px] group-hover/phone:opacity-100 group-hover/phone:ml-3">
          <span className="font-normal mr-2">{t('call')}</span>
          <span className="font-bold tracking-wide">{t('number')}</span>
        </span>
      </a>

      <a 
        href="mailto:info@nu-isoleren.be" 
        className="group/mail pointer-events-auto flex items-center bg-[#C82024] hover:bg-red-800 text-white p-3 rounded-l-md shadow-lg transition-colors duration-300"
      >
        <Image src="/icons/mail.svg" alt="Email" width={24} height={24} className="shrink-0" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 ease-in-out group-hover/mail:max-w-[320px] group-hover/mail:opacity-100 group-hover/mail:ml-3">
          <span className="font-normal mr-2">{t('mail')}</span>
          <span className="font-bold">{t('mailAddress')}</span>
        </span>
      </a>

    </div>
  );
}