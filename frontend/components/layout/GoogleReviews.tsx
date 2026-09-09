import Image from 'next/image';

export default async function GoogleReviews({ label }: { label: string }) {
  let rating = 5.0; 
  
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${process.env.GOOGLE_PLACE_ID}&fields=rating&key=${process.env.GOOGLE_PLACES_API_KEY}`,
      { next: { revalidate: 86400 } }
    );
    
    if (res.ok) {
      const data = await res.json();
      if (data.result?.rating) {
        rating = data.result.rating;
      }
    }
  } catch (error) {
    console.error("Kon Google Reviews niet ophalen", error);
  }

  const reviewLink = `https://search.google.com/local/reviews?placeid=${process.env.GOOGLE_PLACE_ID}`;
  
  const starPercentage = (rating / 5) * 100;

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
          style={{ width: `${starPercentage}%` }}
        >
          ★★★★★
        </div>
      </div>
      
      <span className="text-[10px] md:text-sm font-bold text-gray-600">({rating})</span>
      
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