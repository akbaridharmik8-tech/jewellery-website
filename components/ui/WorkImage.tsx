"use client";

import Image from "next/image";
import { ImageIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  eager?: boolean;
};

/**
 * A work photo that fills its positioned parent. Shows a skeleton while it
 * loads, and a calm placeholder (not a broken image) if it fails.
 */
export default function WorkImage({ src, alt, sizes, eager }: Props) {
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");
  useEffect(() => setState("loading"), [src]);

  if (!src || state === "failed") {
    return (
      <div className="absolute inset-0 grid place-items-center bg-ivory/[0.06]" role={alt ? "img" : undefined} aria-label={alt || undefined}>
        <ImageIcon weight="light" className="h-[2.5em] max-h-10 w-[2.5em] max-w-10 text-greige/50" aria-hidden />
      </div>
    );
  }

  const remote = /^https?:\/\//.test(src);
  return (
    <>
      {state === "loading" && <div className="absolute inset-0 animate-pulse bg-ivory/[0.06]" aria-hidden />}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized={remote}
        loading={eager ? "eager" : undefined}
        onLoad={() => setState("ready")}
        onError={() => setState("failed")}
        className={`object-cover transition-opacity duration-500 ${state === "ready" ? "opacity-100" : "opacity-0"}`}
      />
    </>
  );
}
