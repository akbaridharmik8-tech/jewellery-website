import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <main id="main" className="grain relative grid min-h-svh place-items-center overflow-hidden bg-onyx px-4 text-ivory">
      {/* Viewfinder frame, like the hero */}
      <div className="pointer-events-none absolute inset-3 md:inset-6" aria-hidden>
        {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "left-0 bottom-0 border-l border-b", "right-0 bottom-0 border-r border-b"].map((c) => (
          <span key={c} className={`absolute h-6 w-6 border-champagne/40 md:h-10 md:w-10 ${c}`} />
        ))}
      </div>
      <div className="relative max-w-xl text-center">
        <p className="label text-champagne">Error 404</p>
        <h1 className="display mt-6 text-[clamp(3rem,9vw,7rem)]">This page is out of frame.</h1>
        <p className="mx-auto mt-6 max-w-md text-base text-greige">
          The link may be old or mistyped. Everything {site.brand} Studio does is one click away on the home page.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex min-h-12 items-center gap-3 rounded-full bg-champagne px-6 text-base font-semibold text-onyx transition-colors hover:bg-ivory active:scale-[0.98]"
        >
          <ArrowLeftIcon weight="bold" className="h-4 w-4" aria-hidden />
          Back to the studio
        </Link>
      </div>
    </main>
  );
}
