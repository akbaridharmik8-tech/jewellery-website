"use client";

import { CheckIcon, CopyIcon } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

/** Copies a colour value; confirms calmly in place (landing-page-design B8/B9). */
export default function CopyHex({ value, dark }: { value: string; dark: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard blocked: the value is still visible to copy by hand */
        }
      }}
      aria-label={`Copy ${value}`}
      className={`inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-sm font-semibold tabular-nums transition-[background-color,transform] active:scale-[0.98] ${
        dark ? "bg-ivory/10 text-ivory hover:bg-ivory/20" : "bg-ink/5 text-ink hover:bg-ink/10"
      }`}
    >
      {value}
      {copied ? <CheckIcon weight="bold" className="h-4 w-4" aria-hidden /> : <CopyIcon className="h-4 w-4" aria-hidden />}
      <span className="sr-only" aria-live="polite">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
