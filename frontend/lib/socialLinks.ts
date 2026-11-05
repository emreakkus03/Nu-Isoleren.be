
type SocialLocale = 'nl' | 'fr' | 'en';

type SocialPlatform =
  | 'facebook'
  | 'instagram'
  | 'youtube'
  | 'linkedin';

const socialUrls: Record<
  SocialPlatform,
  Record<SocialLocale, string | undefined>
> = {
  facebook: {
    nl: process.env.NEXT_PUBLIC_FACEBOOK_NL_URL,
    fr: process.env.NEXT_PUBLIC_FACEBOOK_FR_URL,
    en: process.env.NEXT_PUBLIC_FACEBOOK_EN_URL,
  },

  instagram: {
    nl: process.env.NEXT_PUBLIC_INSTAGRAM_NL_URL,
    fr: process.env.NEXT_PUBLIC_INSTAGRAM_FR_URL,
    en: process.env.NEXT_PUBLIC_INSTAGRAM_EN_URL,
  },

  youtube: {
    nl: process.env.NEXT_PUBLIC_YOUTUBE_URL,
    fr: process.env.NEXT_PUBLIC_YOUTUBE_FR_URL,
    en: process.env.NEXT_PUBLIC_YOUTUBE_EN_URL,
  },

  linkedin: {
    nl: process.env.NEXT_PUBLIC_LINKEDIN_URL,
    fr: process.env.NEXT_PUBLIC_LINKEDIN_FR_URL,
    en: process.env.NEXT_PUBLIC_LINKEDIN_EN_URL,
  },
};

export function getSocialLinks(locale: string) {
  const activeLocale: SocialLocale =
    locale === 'fr' || locale === 'en' ? locale : 'nl';

  return {
    facebook:
      socialUrls.facebook[activeLocale] ||
      socialUrls.facebook.nl,

    instagram:
      socialUrls.instagram[activeLocale] ||
      socialUrls.instagram.nl,

    youtube:
      socialUrls.youtube[activeLocale] ||
      socialUrls.youtube.nl,

    linkedin:
      socialUrls.linkedin[activeLocale] ||
      socialUrls.linkedin.nl,
  };
}
