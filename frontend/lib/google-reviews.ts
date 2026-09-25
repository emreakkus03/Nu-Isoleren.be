import 'server-only';
import { unstable_cache } from 'next/cache';

export interface GoogleReviewItem {
  rating: number;
  text: string;
  relativeTime: string | null;
  publishTime: string | null;
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

interface GooglePlacesReview {
  rating?: number;
  originalText?: { text?: string } | null;
  text?: { text?: string } | null;
  relativePublishTimeDescription?: string;
  publishTime?: string;
  googleMapsUri?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  } | null;
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
      .map((review: GooglePlacesReview) => ({
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

        publishTime:
          typeof review.publishTime === 'string'
            ? review.publishTime
            : null,

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
      .filter((review: GoogleReviewItem) => {
        const text = review.text.trim();
        const normalized = text.toLowerCase();

        const lowValueTexts = [
          'top',
          'top!',
          'top :)',
          'top ;)',
          'goed',
          'prima',
        ];

        return (
          review.rating >= 4 &&
          text.length >= 20 &&
          !lowValueTexts.includes(normalized)
        );
      })
      .sort((a: GoogleReviewItem, b: GoogleReviewItem) => {
        if (!a.publishTime && !b.publishTime) {
          return 0;
        }

        if (!a.publishTime) {
          return 1;
        }

        if (!b.publishTime) {
          return -1;
        }

        return (
          new Date(b.publishTime).getTime() -
          new Date(a.publishTime).getTime()
        );
      })
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