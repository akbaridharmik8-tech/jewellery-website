"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { isRender } from "@/lib/site";

type Props = {
  src: string;
  fallback: string;
  alt: string;
  sizes: string;
  eager?: boolean;
  /** Wrapper for centred (contain) renders; real photos fill their positioned parent. */
  containClassName?: string;
  containPadding?: string;
};

/**
 * Work image that falls back to a local 3D render if the remote photo fails,
 * and fits renders (contain) and photos (cover) differently.
 */
export default function WorkImage({ src, fallback, alt, sizes, eager, containClassName, containPadding = "" }: Props) {
  const [current, setCurrent] = useState(src);
  useEffect(() => setCurrent(src), [src]);

  const remote = /^https?:\/\//.test(current);
  const img = (
    <Image
      src={current}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized={remote}
      loading={eager ? "eager" : undefined}
      onError={() => current !== fallback && setCurrent(fallback)}
      className={isRender(current) ? `object-contain ${containPadding}` : "object-cover"}
    />
  );
  if (isRender(current) && containClassName) return <div className={`relative ${containClassName}`}>{img}</div>;
  return img;
}
