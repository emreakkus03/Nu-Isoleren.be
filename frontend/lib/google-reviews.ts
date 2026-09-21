import 'server-only';
import { unstable_cache } from 'next/cache';

export interface GoogleReviewItem {
  rating: number;
  text: string;
  relativeTime: string | null;
  googleMapsUri: string | null;

  author: {
    displayName: string;
    uri: string | null;
    photoUri: string | null;
  };
}

export interface GoogleReviewsData {
  rating: number;
  reviewCount: number;
  googleMapsUri: string | null;
  reviews: GoogleReviewItem[];
}

const fetchGoogleReviews = async (): Promise<GoogleReviewsData | null> => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.error('Google Places environment variables ontbreken.');
    return null;
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask':
            'rating,userRatingCount,googleMapsUri,reviews',
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      console.error(
        'Google Places fout:',
        res.status,
        await res.text()
      );

      return null;
    }

    const data = await res.json();

    const reviews: GoogleReviewItem[] = Array.isArray(data.reviews)
      ? data.reviews
          .map((review: any) => ({
            rating:
              typeof review.rating === 'number'
                ? review.rating
                : 0,

            text:
              review.originalText?.text ||
              review.text?.text ||
              '',

            relativeTime:
              review.relativePublishTimeDescription ||
              null,

            googleMapsUri:
              review.googleMapsUri ||
              null,

            author: {
              displayName:
                review.authorAttribution?.displayName ||
                'Google-gebruiker',

              uri:
                review.authorAttribution?.uri ||
                null,

              photoUri:
                review.authorAttribution?.photoUri ||
                null,
            },
          }))
          .filter(
  (review: GoogleReviewItem) =>
    review.rating >= 4 &&
    review.text.trim().length > 0
)
          .slice(0, 5)
      : [];

    return {
      rating:
        typeof data.rating === 'number'
          ? data.rating
          : 0,

      reviewCount:
        typeof data.userRatingCount === 'number'
          ? data.userRatingCount
          : 0,

      googleMapsUri:
        typeof data.googleMapsUri === 'string'
          ? data.googleMapsUri
          : null,

      reviews,
    };
  } catch (error) {
    console.error(
      'Kon Google Reviews niet ophalen:',
      error
    );

    return null;
  }
};

export const getGoogleReviews = unstable_cache(
  fetchGoogleReviews,
  ['nu-isoleren-google-reviews'],
  {
    revalidate: 86400,
  }
);