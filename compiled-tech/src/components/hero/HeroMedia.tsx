"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const motionQuery = "(prefers-reduced-motion: reduce)";

function subscribe(listener: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

function reduceMotion() {
  return window.matchMedia(motionQuery).matches;
}

export function HeroMedia() {
  const reduced = useSyncExternalStore(subscribe, reduceMotion, () => true);
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;

    let visible = true;
    function update() {
      if (!element) return;
      if (!paused && visible && !document.hidden) {
        void element.play().catch(() => {}); // Autoplay can be disabled by the browser.
      } else {
        element.pause();
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, [paused, reduced]);

  return (
    <>
      <div className="pointer-events-none absolute -inset-6 z-0 bg-ink" aria-hidden="true">
        <Image src="/hero/poster.webp" alt="" fill preload unoptimized className="object-cover" />
        {!reduced && (
          <video
            ref={video}
            className="absolute inset-0 size-full object-cover"
            loop
            muted
            playsInline
            preload="none"
            poster="/hero/poster.webp"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          >
            <source src="/hero/hero.webm" type="video/webm" />
            <source src="/hero/hero.mp4" type="video/mp4" />
          </video>
        )}
      </div>
      {!reduced && (
        <button
          type="button"
          aria-label={playing ? "Pause background video" : "Play background video"}
          onClick={() => {
            if (playing) {
              setPaused(true);
              video.current?.pause();
            } else {
              setPaused(false);
              void video.current?.play().catch(() => {});
            }
          }}
          className="absolute right-3 top-18 z-30 grid size-11 place-items-center rounded-full border border-line bg-ink/80 text-frost focus-visible:outline-2 focus-visible:outline-offset-2 sm:right-6 sm:top-20"
        >
          {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
        </button>
      )}
    </>
  );
}
