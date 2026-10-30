export function HeroMedia() {
  return (
    <div className="absolute -inset-6 z-0 bg-ink">
      <video
        className="absolute inset-0 size-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        // preload="metadata" instead of "auto": buffers only the first frames
        // (~KB) instead of the full 2.5MB before playback. autoplay still
        // starts the video as soon as enough is buffered.
        preload="metadata"
        // Poster paints instantly and gives crawlers/Lighthouse an LCP element
        // (a <video autoplay> without one reports NO_LCP in Lighthouse).
        poster="/hero/poster.jpg"
        aria-hidden="true"
      >
        <source src="/hero/hero.webm" type="video/webm" />
        <source src="/hero/hero.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
