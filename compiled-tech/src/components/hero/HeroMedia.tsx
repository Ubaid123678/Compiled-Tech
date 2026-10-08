"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function HeroMedia() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (media.matches || window.innerWidth < 900 || connection?.saveData) return;

    const enableVideo = () => setVideoEnabled(true);
    if (document.readyState === "complete") enableVideo();
    else window.addEventListener("load", enableVideo, { once: true });

    return () => window.removeEventListener("load", enableVideo);
  }, []);

  useEffect(() => {
    if (!videoEnabled) return;
    videoRef.current?.play().catch(() => undefined);
  }, [videoEnabled]);

  useEffect(() => {
    const frame = wrapperRef.current?.closest<HTMLElement>("[data-hero-frame]");
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!frame || media.matches || window.innerWidth < 900 || !window.matchMedia("(pointer: fine)").matches) return;

    const onPointerMove = (event: PointerEvent) => {
      const rect = frame.getBoundingClientRect();
      const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
      const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
      x.set(-normalizedX * 20);
      y.set(-normalizedY * 12);
    };
    const onPointerLeave = () => {
      x.set(0);
      y.set(0);
    };

    frame.addEventListener("pointermove", onPointerMove);
    frame.addEventListener("pointerleave", onPointerLeave);
    return () => {
      frame.removeEventListener("pointermove", onPointerMove);
      frame.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [x, y]);

  return (
    <motion.div
      ref={wrapperRef}
      className="absolute -inset-6 z-0"
      style={{ x: springX, y: springY }}
    >
      <Image
        src="/hero/poster.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {videoEnabled && (
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-[600ms] [&.is-playing]:opacity-100"
          muted
          loop
          playsInline
          aria-hidden="true"
          onPlaying={(event) => event.currentTarget.classList.add("is-playing")}
          onError={(event) => event.currentTarget.classList.remove("is-playing")}
        >
          <source src="/hero/hero.mp4" type="video/mp4" />
        </video>
      )}
    </motion.div>
  );
}
