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

interface GoogleBusinessReview {
  starRating?: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  comment?: string;
  createTime?: string;
  updateTime?: string;
  reviewer?: {
    displayName?: string;
    profilePhotoUrl?: string;
  };
}

interface GoogleBusinessReviewsResponse {
  reviews?: GoogleBusinessReview[];
  nextPageToken?: string;
}

interface GoogleOAuthResponse {
  access_token?: string;
}

const businessRatingToNumber = (
  rating?: GoogleBusinessReview['starRating']
): number => {
  switch (rating) {
    case 'FIVE':
      return 5;
    case 'FOUR':
      return 4;
    case 'THREE':
      return 3;
    case 'TWO':
      return 2;
    case 'ONE':
      return 1;
    default:
      return 0;
  }
};

const filterAndSortReviews = (
  reviews: GoogleReviewItem[]
): GoogleReviewItem[] => {
  return reviews
    .filter((review) => {
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
    .sort((a, b) => {
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
    .slice(0, 5);
};

const getGoogleBusinessAccessToken = async (): Promise<string | null> => {
  const clientId = process.env.GOOGLE_BUSINESS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_BUSINESS_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_BUSINESS_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    console.error('Google Business OAuth environment variables ontbreken.');
    return null;
  }

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(
        'Google Business OAuth fout:',
        res.status,
        await res.text()
      );

      return null;
    }

    const data = (await res.json()) as GoogleOAuthResponse;

    return data.access_token || null;
  } catch (error) {
    console.error(
      'Kon Google Business access token niet ophalen:',
      error
    );

    return null;
  }
};

const fetchGoogleBusinessReviews =
  async (): Promise<GoogleReviewItem[] | null> => {
    const accountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID;
    const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID;

    if (!accountId || !locationId) {
      console.error(
        'Google Business account/location environment variables ontbreken.'
      );

      return null;
    }

    const accessToken = await getGoogleBusinessAccessToken();

    if (!accessToken) {
      return null;
    }

    try {
      const reviews: GoogleReviewItem[] = [];
      let nextPageToken: string | null = null;

      do {
        const params = new URLSearchParams({
          pageSize: '50',
          orderBy: 'updateTime desc',
        });

        if (nextPageToken) {
          params.set('pageToken', nextPageToken);
        }

        const res = await fetch(
          `https://mybusiness.googleapis.com/v4/accounts/${encodeURIComponent(
            accountId
          )}/locations/${encodeURIComponent(
            locationId
          )}/reviews?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: 'no-store',
          }
        );

        if (!res.ok) {
          console.error(
            'Google Business Profile Reviews fout:',
            res.status,
            await res.text()
          );

          return null;
        }

        const data =
          (await res.json()) as GoogleBusinessReviewsResponse;

        if (Array.isArray(data.reviews)) {
          reviews.push(
            ...data.reviews.map((review): GoogleReviewItem => ({
              rating: businessRatingToNumber(review.starRating),

              text:
                typeof review.comment === 'string'
                  ? review.comment
                  : '',

              relativeTime: null,

              publishTime:
                typeof review.createTime === 'string'
                  ? review.createTime
                  : typeof review.updateTime === 'string'
                    ? review.updateTime
                    : null,

              googleMapsUri: null,

              author: {
                displayName:
                  review.reviewer?.displayName ||
                  'Google-gebruiker',

                uri: null,

                photoUri:
                  review.reviewer?.profilePhotoUrl ||
                  null,
              },
            }))
          );
        }

        nextPageToken =
          typeof data.nextPageToken === 'string' &&
          data.nextPageToken.length > 0
            ? data.nextPageToken
            : null;
      } while (nextPageToken);

      return filterAndSortReviews(reviews);
    } catch (error) {
      console.error(
        'Kon Google Business Profile reviews niet ophalen:',
        error
      );

      return null;
    }
  };

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

    const placesReviews: GoogleReviewItem[] = Array.isArray(data.reviews)
      ? data.reviews.map((review: GooglePlacesReview) => ({
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
      : [];

    const fallbackReviews = filterAndSortReviews(placesReviews);

    const businessReviews = await fetchGoogleBusinessReviews();

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

      reviews:
        businessReviews && businessReviews.length > 0
          ? businessReviews
          : fallbackReviews,
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