interface CityProcessSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  steps: Array<{
    number: string;
    title: string;
    description: string;
  }>;
}

export default function CityProcessSection({
  eyebrow,
  title,
  description,
  steps,
}: CityProcessSectionProps) {
  return (
    <section className="w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10 sm:mb-14">
          <span className="text-xs sm:text-sm md:text-base font-extrabold tracking-wider text-[#1A669A] uppercase">
            {eyebrow}
          </span>

          <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-black tracking-tight leading-tight">
            {title}
          </h2>

          <p className="mt-4 text-sm sm:text-base text-black leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-start"
            >
              <span className="text-4xl sm:text-5xl font-extrabold text-[#C82024] leading-none">
                {step.number}
              </span>

              <div className="w-full h-px bg-slate-200 my-5" />

              <h3 className="text-lg sm:text-xl font-extrabold text-black leading-tight">
                {step.title}
              </h3>

              <p className="mt-3 text-sm sm:text-base text-black leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}