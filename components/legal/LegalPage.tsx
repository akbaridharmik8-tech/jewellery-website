import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";

export type LegalSection = { heading: string; body: string };

const SPLIT = /(\{\{.*?\}\})/;
const IS_PLACEHOLDER = /^\{\{.*\}\}$/;

function Text({ text }: { text: string }) {
  return (
    <>
      {text.split(SPLIT).map((part, i) =>
        IS_PLACEHOLDER.test(part) ? (
          <mark key={i} title="Fill this in" className="rounded-sm border border-dashed border-gold-ink/50 bg-gold/15 px-1 text-ink">
            {part.slice(2, -2)}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/** Shared layout for the privacy and terms pages: a simple bar back home and readable text. */
export default function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: LegalSection[] }) {
  return (
    <div className="min-h-svh bg-ivory text-ink">
      <header className="border-b border-line-light">
        <div className="container-x flex h-16 items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="display text-3xl leading-none">{site.brand}</span>
            <span className="label hidden text-gold-ink sm:inline">Studio</span>
          </Link>
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:text-gold-ink">
            <ArrowLeftIcon className="h-4 w-4" aria-hidden />
            Back to site
          </Link>
        </div>
      </header>
      <main id="main" className="container-x max-w-3xl py-16 md:py-24">
        <p className="label text-gold-ink">Legal</p>
        <h1 className="display mt-4 text-[clamp(2.6rem,6vw,4.5rem)]">{title}</h1>
        <p className="mt-4 text-sm text-stone">
          Last updated: <Text text={updated} />
        </p>
        <p className="mt-8 rounded-lg border border-dashed border-gold-ink/40 bg-gold/10 p-4 text-sm text-ink">
          This is a starting template. Highlighted parts need your details, and the whole page should be reviewed by someone qualified before launch.
        </p>
        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl font-semibold">{s.heading}</h2>
              <p className="mt-3 text-base text-stone">
                <Text text={s.body} />
              </p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
