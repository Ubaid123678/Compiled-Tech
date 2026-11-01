import { contactInfo } from "@/data/contact";

export function BookingEmbed() {
  const bookingUrl = contactInfo.calComUrl.trim();

  return (
    <div id="book" className="w-full">
      <h3 id="prefer-a-call" className="font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel mb-4">
        Prefer a call?
      </h3>
      {bookingUrl ? (
        <div className="h-[680px] w-full overflow-hidden rounded-[12px] border border-line bg-night sm:h-[720px] lg:h-[760px]">
          <iframe
            src={bookingUrl}
            title="Book a call with Compiled Tech"
            className="h-full w-full border-0"
            allow="camera; microphone; fullscreen"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="rounded-[12px] border border-line bg-night p-6">
          <p className="text-base leading-[1.6] text-mist">
            Booking is temporarily unavailable. Please email us and we will arrange a time.
          </p>
        </div>
      )}
      <p className="mt-3 text-sm text-mist/60">
        Or email us at{" "}
        <a href={`mailto:${contactInfo.email}`} className="text-steel hover:text-frost underline">
          {contactInfo.email}
        </a>
      </p>
    </div>
  );
}