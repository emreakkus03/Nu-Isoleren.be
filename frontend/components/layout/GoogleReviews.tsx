import Image from 'next/image';

interface GoogleReviewsProps {
  label: string;
  variant?: 'compact' | 'footer';
  outOfFiveLabel?: string;
  basedOnLabel?: string;
  reviewsLabel?: string;
}

export default async function GoogleReviews({
  label,
  variant = 'compact',
  outOfFiveLabel = 'uit 5',
  basedOnLabel = 'op basis van',
  reviewsLabel = 'reviews',
}: GoogleReviewsProps) {
  let rating = 5.0;
  let reviewCount: number | null = null;

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${process.env.GOOGLE_PLACE_ID}&fields=rating,user_ratings_total&key=${process.env.GOOGLE_PLACES_API_KEY}`,
      {
        next: {
          revalidate: 86400,
        },
      },
    );

    if (res.ok) {
      const data = await res.json();

      if (data.result?.rating) {
        rating = data.result.rating;
      }

      if (typeof data.result?.user_ratings_total === 'number') {
        reviewCount = data.result.user_ratings_total;
      }
    }
  } catch (error) {
    console.error('Kon Google Reviews niet ophalen', error);
  }

  const reviewLink = `https://search.google.com/local/reviews?placeid=${process.env.GOOGLE_PLACE_ID}`;

  const starPercentage = (rating / 5) * 100;

  if (variant === 'footer') {
    return (
      <a
        href={reviewLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm sm:text-base text-slate-950 transition hover:opacity-75"
      >
        <span className="font-extrabold">
          {label}
        </span>

        <div className="relative inline-block text-lg sm:text-xl tracking-[0.08em] text-slate-200">
          ★★★★★

          <div
            className="absolute left-0 top-0 overflow-hidden whitespace-nowrap text-[#FFC107]"
            style={{
              width: `${starPercentage}%`,
            }}
          >
            ★★★★★
          </div>
        </div>

        <span className="font-medium">
          {rating.toFixed(1)} {outOfFiveLabel}
        </span>

        {reviewCount !== null && (
          <span className="font-medium">
            {basedOnLabel}{' '}
            <span className="font-extrabold underline underline-offset-2">
              {reviewCount} {reviewsLabel}
            </span>
          </span>
        )}

        <Image
          src="/icons/google.svg"
          alt="Google"
          width={72}
          height={24}
          className="ml-1 h-auto w-[64px] sm:w-[72px]"
        />
      </a>
    );
  }

  return (
    <a
      href={reviewLink}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-gray-800 hover:opacity-80 transition cursor-pointer"
    >
      <span>{label}</span>

      <div className="relative inline-block text-gray-300 text-sm md:text-lg tracking-widest">
        ★★★★★

        <div
          className="absolute top-0 left-0 overflow-hidden text-[#FFC107] whitespace-nowrap"
          style={{
            width: `${starPercentage}%`,
          }}
        >
          ★★★★★
        </div>
      </div>

      <span className="text-[10px] md:text-sm font-bold text-gray-600">
        ({rating.toFixed(1)})
      </span>

      <Image
        src="/icons/google.svg"
        alt="Google Reviews"
        width={60}
        height={20}
        className="ml-1 w-10 md:w-[60px]"
      />
    </a>
  );
}