"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type HeroMediaProps = {
  poster: string;
  videoWebm?: string;
  videoMp4?: string;
  className?: string;
};

export function HeroMedia({ poster, videoWebm, videoMp4, className = "" }: HeroMediaProps) {
  const [loaded, setLoaded] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const handleMove = (e: MouseEvent) => {
      const rect = frameRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setPointer({ x, y });
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [reducedMotion]);

  useEffect(() => {
    if (!videoWebm && !videoMp4) return;
    const onLoad = () => {
      const vp = navigator.connection;
      if (vp?.saveData || vp?.effectiveType === "slow-2g" || vp?.effectiveType === "2g") return;
      if (window.innerWidth < 900) return;
      setPlayVideo(true);
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, [videoWebm, videoMp4]);

  const posterStyle = {
    transform: `translate(${pointer.x * 10}px, ${pointer.y * 10}px)`,
    transition: "transform 0.3s ease-out",
  };

  const videoStyle = {
    transform: `translate(${pointer.x * 16}px, ${pointer.y * 16}px) scale(1.02)`,
    transition: "transform 0.3s ease-out",
  };

  return (
    <div
      ref={frameRef}
      className={`relative overflow-hidden rounded-[28px] border border-line ${className}`}
      aria-hidden={true}
    >
      <motion.div
        className="absolute inset-0"
        style={posterStyle}
        animate={{ opacity: playVideo && videoRef.current?.readyState >= 2 ? 0 : 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={poster}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          onLoad={() => setLoaded(true)}
        />
      </motion.div>

      {(videoWebm || videoMp4) && playVideo && !reducedMotion && window.innerWidth >= 900 && (
        <motion.video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          style={videoStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {videoWebm && <source src={videoWebm} type="video/webm" />}
          {videoMp4 && <source src={videoMp4} type="video/mp4" />}
        </motion.video>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(7,11,17,0.8)_100%)] pointer-events-none" />
    </div>
  );
}