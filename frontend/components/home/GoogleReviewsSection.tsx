import Image from 'next/image';

import GoogleReviewsCarousel from '@/components/home/GoogleReviewsCarousel';
import { getGoogleReviews } from '@/lib/google-reviews';

interface GoogleReviewsSectionProps {
  eyebrow: string;
  title: string;

  scoreLabel: string;
  outOfFiveLabel: string;
  basedOnLabel: string;
  reviewsLabel: string;
  selectionLabel: string;

  previousLabel: string;
  nextLabel: string;
}

export default async function GoogleReviewsSection({
  eyebrow,
  title,
  scoreLabel,
  outOfFiveLabel,
  basedOnLabel,
  reviewsLabel,
  selectionLabel,
  previousLabel,
  nextLabel,
}: GoogleReviewsSectionProps) {
  const data = await getGoogleReviews();

  if (!data) {
    return null;
  }

  const reviewsUrl =
    data.googleMapsUri || '#';

  return (
    <section className="w-full bg-slate-50 py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10 sm:mb-12 lg:mb-14">
          <span className="text-xs sm:text-sm md:text-base font-extrabold tracking-wider text-[#1A669A] uppercase">
            {eyebrow}
          </span>

          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-black max-md:text-balance max-md:[overflow-wrap:anywhere]">
            {title}
          </h2>
        </div>

        {data.reviews.length > 0 && (
          <GoogleReviewsCarousel
            reviews={data.reviews}
            previousLabel={previousLabel}
            nextLabel={nextLabel}
          />
        )}

        <div className="mt-8 sm:mt-10 flex flex-col items-center text-center">
          <p className="text-sm sm:text-base text-black leading-relaxed">
            {scoreLabel}{' '}

            <strong className="font-extrabold">
              {data.rating.toFixed(1)}
            </strong>{' '}

            {outOfFiveLabel}{' '}

            {basedOnLabel}{' '}

            <a
              href={reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold underline underline-offset-2 hover:text-[#C82024] transition-colors"
            >
              {data.reviewCount} {reviewsLabel}
            </a>
            .
          </p>

          <p className="mt-1 text-sm text-slate-600">
            {selectionLabel}
          </p>

          <a
            href={reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 transition-opacity hover:opacity-75"
          >
            <Image
              src="/icons/google.svg"
              alt="Google"
              width={762}
              height={248}
              className="w-[78px] sm:w-[86px] h-auto"
            />
          </a>
        </div>

      </div>
    </section>
  );
}