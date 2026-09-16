export default function ContactMap() {
  return (
    <section className="w-full">
      <iframe
        src="https://www.google.com/maps?q=Neerstraat%205%2C%209220%20Hamme%2C%20Belgi%C3%AB&output=embed"
        width="100%"
        height="500"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block w-full h-[360px] sm:h-[420px] md:h-[480px] lg:h-[520px] border-0"
        title="Nu-Isoleren locatie op Google Maps"
      />
    </section>
  );
}