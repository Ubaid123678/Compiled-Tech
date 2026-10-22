"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * WhatsApp-style project gallery:
 *  - collapsed: big first image, then a 2×2 thumbnail block with a "+N" overlay
 *  - click any tile: native <dialog> lightbox (Esc/focus-trap/backdrop for free
 *    from the platform) with prev/next arrows, a thumbnail strip and a close X
 *
 * ponytail: fixed 1+4 layout regardless of image count, so the section height
 * never changes. Upgrade path: a proper grid/masonry if galleries grow past ~15.
 */
export function GalleryLightbox({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const show = useCallback((i: number) => {
    setIndex(i);
    setOpen(true);
    dialogRef.current?.showModal();
  }, []);

  const close = useCallback(() => {
    dialogRef.current?.close();
    setOpen(false);
  }, []);

  const go = useCallback(
    (step: number) => setIndex((current) => (current + step + images.length) % images.length),
    [images.length]
  );

  // Native <dialog> fires this on Esc/backdrop/programmatic close — one place to sync state.
  const onDialogClose = () => setOpen(false);

  const hero = images[0];
  const thumbs = images.slice(1, 5);
  const remaining = images.length - 5;

  // 1–2 images: single column, nothing to overlay.
  const useSimpleGrid = images.length <= 2;

  return (
    <>
      {useSimpleGrid ? (
        <div className="grid gap-4">
          {images.map((image, i) => (
            <button
              key={`${image}-${i}`}
              type="button"
              onClick={() => show(i)}
              className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] border border-line focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-steel"
            >
              <Image
                src={image}
                alt={`${title} project image ${i + 1}`}
                fill
                loading={i === 0 ? "eager" : "lazy"}
                className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => show(0)}
            className="relative block aspect-[16/9] w-full overflow-hidden rounded-[20px] border border-line focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-steel"
          >
            <Image
              src={hero}
              alt={`${title} project image 1`}
              fill
              loading="eager"
              className="object-cover transition-transform duration-500 hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 900px"
            />
          </button>

          <div className={`grid gap-4 ${thumbs.length >= 4 ? "grid-cols-2 lg:grid-cols-4" : thumbs.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
            {thumbs.map((image, i) => {
              const isLast = i === thumbs.length - 1 && remaining > 0;
              return (
                <button
                  key={`${image}-${i}`}
                  type="button"
                  onClick={() => show(i + 1)}
                  className="relative aspect-[4/3] overflow-hidden rounded-[16px] border border-line focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-steel"
                >
                  <Image
                    src={image}
                    alt={`${title} project image ${i + 2}`}
                    fill
                    loading="lazy"
                    className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  {isLast && (
                    <span className="absolute inset-0 flex items-center justify-center bg-ink/75 font-display text-[clamp(1.25rem,4vw,2rem)] font-semibold text-frost">
                      +{remaining}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <dialog
        ref={dialogRef}
        onClose={onDialogClose}
        onClick={(event) => {
          // Clicking the backdrop (the dialog element itself) closes it.
          if (event.target === dialogRef.current) close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") go(1);
          if (event.key === "ArrowLeft") go(-1);
        }}
        className="m-auto max-h-[95vh] w-[min(96vw,1200px)] rounded-[20px] border border-line bg-ink p-0 text-frost backdrop:bg-ink/85 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className="flex max-h-[95vh] flex-col">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="font-mono text-xs text-steel">
                {index + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label="Close gallery"
                className="rounded-full p-2 text-mist hover:bg-slate hover:text-frost"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              <div className="relative aspect-[16/10] max-h-[62vh] w-full">
                <Image
                  src={images[index]}
                  alt={`${title} project image ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1200px) 96vw, 1200px"
                />
              </div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-ink/70 p-2.5 text-frost hover:bg-slate"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-ink/70 p-2.5 text-frost hover:bg-slate"
                  >
                    <ChevronRight className="size-6" />
                  </button>
                </>
              )}
            </div>

            <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-line p-3">
              {images.map((image, i) => (
                <button
                  key={`${image}-thumb-${i}`}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === index}
                  className={`relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-[8px] border transition-opacity ${
                    i === index ? "border-steel opacity-100" : "border-line opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={image} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
