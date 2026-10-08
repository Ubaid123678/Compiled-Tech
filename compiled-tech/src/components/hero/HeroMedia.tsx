"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function HeroMedia() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (media.matches || window.innerWidth < 900 || connection?.saveData) return;

    const video = videoRef.current;
    const startVideo = () => video?.play().catch(() => undefined);
    startVideo();
    window.addEventListener("load", startVideo, { once: true });
    return () => window.removeEventListener("load", startVideo);
  }, []);

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
      <video
        ref={videoRef}
        className="hero-video absolute inset-0 z-[1] size-full object-cover opacity-100 transition-opacity duration-200 [&.is-looping]:opacity-0"
        autoPlay
        muted
        playsInline
        preload="auto"
        poster="/hero/poster.webp"
        aria-hidden="true"
        onError={(event) => event.currentTarget.classList.remove("is-playing")}
        onEnded={(event) => {
          const video = event.currentTarget;
          video.classList.add("is-looping");
          video.currentTime = 0;
          void video.play().then(() => {
            window.setTimeout(() => video.classList.remove("is-looping"), 180);
          }).catch(() => video.classList.remove("is-looping"));
        }}
      >
        <source src="/hero/hero.mp4" type="video/mp4" media="(min-width: 900px)" />
      </video>
    </motion.div>
  );
}
