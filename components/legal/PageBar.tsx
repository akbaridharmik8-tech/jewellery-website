import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";

/** Simple top bar for secondary pages, with a clear way back to the site. */
export default function PageBar() {
  return (
    <header className="border-b border-line-light">
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="display text-3xl leading-none">{site.brand}</span>
          <span className="label hidden text-taupe sm:inline">Studio</span>
        </Link>
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:text-taupe">
          <ArrowLeftIcon className="h-4 w-4" aria-hidden />
          Back to site
        </Link>
      </div>
    </header>
  );
}
