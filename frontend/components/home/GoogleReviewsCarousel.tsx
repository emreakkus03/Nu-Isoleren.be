'use client';

import { useRef } from 'react';
import type { GoogleReviewItem } from '@/lib/google-reviews';

interface GoogleReviewsCarouselProps {
  reviews: GoogleReviewItem[];
  previousLabel: string;
  nextLabel: string;
}

export default function GoogleReviewsCarousel({
  reviews,
  previousLabel,
  nextLabel,
}: GoogleReviewsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const card = container.querySelector(
      '[data-review-card]'
    ) as HTMLElement | null;

    const amount =
      (card?.offsetWidth || 320) + 24;

    container.scrollBy({
      left:
        direction === 'left'
          ? -amount
          : amount,
      behavior: 'smooth',
    });
  };

  if (!reviews.length) {
    return null;
  }

  return (
    <div className="relative">
      {reviews.length > 3 && (
        <button
          type="button"
          onClick={() => scroll('left')}
          aria-label={previousLabel}
          className="
            hidden
            lg:flex
            absolute
            -left-5
            xl:-left-14
            top-1/2
            -translate-y-1/2
            z-20
            w-11
            h-11
            items-center
            justify-center
            rounded-full
            border-2
            border-slate-800
            bg-white
            text-slate-900
            transition-all
            duration-200
            hover:bg-slate-900
            hover:text-white
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      <div
        ref={containerRef}
        className="
          flex
          gap-5
          sm:gap-6
          overflow-x-auto
          snap-x
          snap-mandatory
          scroll-smooth
          pb-2

          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {reviews.map((review, index) => {
          const reviewHref =
            review.googleMapsUri ||
            review.author.uri ||
            '#';

          const filledStars = Math.round(
            review.rating
          );

          return (
            <a
              key={`${review.author.displayName}-${index}`}
              data-review-card
              href={reviewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                shrink-0
                snap-start

                w-[88%]
                sm:w-[calc(50%-12px)]
                lg:w-[calc(33.333%-16px)]

                min-h-[250px]

                flex
                flex-col

                rounded-xl
                border-2
                border-[#1A4F86]
                bg-white

                px-5
                py-6
                sm:px-6
                sm:py-7

                transition-all
                duration-200

                hover:-translate-y-1
                hover:shadow-lg
              "
            >
              <div
                className="flex items-center text-xl tracking-[0.08em]"
                aria-label={`${review.rating} / 5`}
              >
                <span className="text-[#FFB400]">
                  {'★'.repeat(filledStars)}
                </span>

                <span className="text-slate-200">
                  {'★'.repeat(
                    Math.max(
                      0,
                      5 - filledStars
                    )
                  )}
                </span>
              </div>

              <p className="mt-5 text-base sm:text-lg text-slate-700 leading-snug line-clamp-6">
                {review.text}
              </p>

              <div className="mt-auto pt-6 flex items-center gap-3">
                {review.author.photoUri && (
                  <img
                    src={review.author.photoUri}
                    alt={review.author.displayName}
                    width={38}
                    height={38}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                  />
                )}

                <div className="min-w-0">
                  <p className="font-extrabold text-black truncate">
                    {review.author.displayName}
                  </p>

                  {review.relativeTime && (
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
                      {review.relativeTime}
                    </p>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {reviews.length > 3 && (
        <button
          type="button"
          onClick={() => scroll('right')}
          aria-label={nextLabel}
          className="
            hidden
            lg:flex
            absolute
            -right-5
            xl:-right-14
            top-1/2
            -translate-y-1/2
            z-20
            w-11
            h-11
            items-center
            justify-center
            rounded-full
            border-2
            border-slate-800
            bg-white
            text-slate-900
            transition-all
            duration-200
            hover:bg-slate-900
            hover:text-white
          "
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5"
            aria-hidden="true"
          >
            <path
              d="M9 6L15 12L9 18"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}