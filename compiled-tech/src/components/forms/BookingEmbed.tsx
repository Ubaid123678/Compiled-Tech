import { contactInfo } from "@/data/contact";

export function BookingEmbed() {
  return (
    <div className="w-full">
      <h3 className="font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel mb-4">
        Prefer a call?
      </h3>
      <div className="aspect-[4/3] w-full rounded-[12px] overflow-hidden border border-line bg-night">
        <iframe
          src={contactInfo.calComUrl}
          title="Book a call with Compiled Tech"
          className="w-full h-full border-0"
          allow="camera; microphone; fullscreen"
          loading="lazy"
        />
      </div>
      <p className="mt-3 text-sm text-mist/60">
        Or email us at{" "}
        <a href={`mailto:${contactInfo.email}`} className="text-steel hover:text-frost underline">
          {contactInfo.email}
        </a>
      </p>
    </div>
  );
}