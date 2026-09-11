import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";

import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import GoogleReviews from "@/components/layout/GoogleReviews";
import MobileMenu from "@/components/layout/MobileMenu";
import MobileQuickContact from "@/components/layout/MobileQuickContact";
import HeaderNav from "@/components/layout/HeaderNav";

export default function Header() {
  const t = useTranslations("Header");

  return (
    <header className="w-full bg-white flex flex-col z-50 sticky top-0 border-b border-gray-200 shadow-sm">
      <div className="bg-gray-50 border-b border-gray-100 w-full">
        <div className="max-w-7xl w-full mx-auto py-2 px-4 md:px-6 text-sm flex justify-center md:justify-between items-center">
          <GoogleReviews label={t("reviews")} />

          <div className="hidden md:flex items-center gap-3 lg:gap-6 font-medium text-gray-700 text-xs lg:text-sm">
            <Link
              href="/"
              className="hover:text-[#C82024] transition whitespace-nowrap"
            >
              {t("topbar.serviceAreas")}
            </Link>
            <Link
              href="/"
              className="hover:text-[#C82024] transition whitespace-nowrap"
            >
              {t("topbar.aboutUs")}
            </Link>
            <Link
              href="/"
              className="hover:text-[#C82024] transition whitespace-nowrap"
            >
              {t("topbar.grants")}
            </Link>
            <Link
              href="/"
              className="hover:text-[#C82024] transition whitespace-nowrap"
            >
              {t("topbar.faq")}
            </Link>
            <Link
              href="/"
              className="hover:text-[#C82024] transition whitespace-nowrap"
            >
              {t("topbar.contact")}
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto py-4 px-4 md:px-6">
        <div className="md:hidden relative flex items-center justify-center">
          <Link href="/" className="shrink-0">
            <Image
              src="/logo/logo.svg"
              alt="Nu-Isoleren Logo"
              width={160}
              height={40}
              priority
              style={{ height: 'auto' }}
              className="w-[160px]"
            />
          </Link>

          <div className="absolute right-0">
            <MobileMenu />
          </div>
        </div>

        <div className="hidden md:flex items-center justify-between w-full">
          <Link href="/" className="flex-1 flex justify-start shrink-0">
            <Image
              src="/logo/logo.svg"
              alt="Nu-Isoleren Logo"
              width={200}
              height={50}
              priority
              style={{ height: 'auto' }}
              className="w-[200px]"
            />
          </Link>

          <HeaderNav />

          <div className="flex-1 flex justify-end items-center gap-4">
            <Link
              href="/"
              className="hidden md:inline-block bg-[#C82024] hover:bg-red-800 text-white px-6 py-2.5 rounded-full font-bold transition shadow-md whitespace-nowrap lg:text-lg"
            >
              {t("mainbar.cta")}
            </Link>

            <div className="lg:hidden flex items-center">
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>

      <MobileQuickContact />
    </header>
  );
}