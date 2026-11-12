import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer data-header="light" className="relative overflow-hidden border-t border-line-light pt-20 pb-8 text-taupe">
      <div className="container-x">
        <div className="grid gap-10 text-sm sm:grid-cols-2 md:grid-cols-12">
          <p className="max-w-xs text-ink md:col-span-4">{site.tagline}</p>
          <nav aria-label="Footer" className="md:col-span-2 md:col-start-7">
            <p className="label text-ink">Studio</p>
            <ul className="mt-4 space-y-2">
              {[
                ["#services", "Services"],
                ["#process", "Process"],
              ].map(([href, l]) => (
                <li key={href}>
                  <a href={href} className="hover:text-ink">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {/* Only social profiles that are filled in are shown, so there are no dead links */}
          {Object.values(site.social).some(Boolean) && (
            <div className="md:col-span-2">
              <p className="label text-ink">Follow</p>
              <ul className="mt-4 space-y-2">
                {Object.entries(site.social)
                  .filter(([, href]) => href)
                  .map(([k, href]) => (
                    <li key={k}>
                      <a href={href} className="capitalize hover:text-ink" target="_blank" rel="noopener">
                        {k}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          <div className="md:col-span-2">
            <p className="label text-ink">Say hello</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a href={`mailto:${site.email}`} className="break-all hover:text-ink">
                  {site.email}
                </a>
              </li>
              <li>{site.phone}</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="display pointer-events-none mt-16 text-center text-[24vw] leading-[0.8] text-ink/[0.05] select-none" aria-hidden>
        {site.brand}
      </p>

      <div className="container-x mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line-light pt-6 text-xs">
        <p>
          © {year} {site.brand} Studio. All rights reserved.
        </p>
        <nav aria-label="Legal" className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
          <Link href="/brand" className="hover:text-ink">
            Brand colours
          </Link>
          <a href="#top" className="hover:text-ink">
            Back to top
          </a>
        </nav>
      </div>
    </footer>
  );
}
