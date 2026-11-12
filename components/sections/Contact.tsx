"use client";

import { useState } from "react";
import { services, site, waLink } from "@/lib/site";
import { MaskLines, Reveal, SectionLabel } from "@/components/ui/Reveal";
import { ArrowRightIcon, CaretDownIcon } from "@phosphor-icons/react/dist/ssr";

const BUDGETS = ["Under ₹50k", "₹50k to ₹2L", "₹2L to ₹5L", "₹5L+"];

type Errors = Partial<Record<"name" | "phone", string>>;

const inputCls =
  "peer w-full border-0 border-b border-ink/20 bg-transparent px-0 pt-6 pb-3 text-base text-ink placeholder-transparent transition-colors focus:border-ink focus:ring-0 focus:outline-none aria-[invalid=true]:border-[#9e2f3b]";
const labelCls =
  "pointer-events-none absolute top-0 left-0 text-xs font-semibold tracking-[0.14em] text-taupe uppercase transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-focus:top-0 peer-focus:text-xs peer-focus:font-semibold peer-focus:tracking-[0.14em] peer-focus:uppercase";

function Field({ id, label, error, ...rest }: { id: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <input id={id} name={id} placeholder={label} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={inputCls} {...rest} />
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      {error && (
        <p id={`${id}-err`} className="mt-2 text-sm text-[#9e2f3b]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [sent, setSent] = useState(false);

  function validate(form: HTMLFormElement) {
    const d = new FormData(form);
    const e: Errors = {};
    if (String(d.get("name") ?? "").trim().length < 2) e.name = "Please tell us your name.";
    const digits = String(d.get("phone") ?? "").replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 13) e.phone = "Enter your 10 digit mobile number so we can call you back.";
    return e;
  }

  return (
    <section id="contact" data-header="light" className="relative border-t border-line-light py-[clamp(88px,11vw,160px)] text-ink">
      <div className="container-x grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel no="07">Start a project</SectionLabel>
          <h2 className="display mt-6 text-[clamp(2.8rem,6vw,6rem)]">
            <MaskLines lines={["Let’s make it", <em key="e" className="text-taupe">impossible</em>, "to scroll past."]} />
          </h2>
          <Reveal>
            <dl className="mt-12 grid gap-6 text-base sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <dt className="label text-taupe">WhatsApp / call</dt>
                <dd className="mt-2">
                  <a className="underline decoration-taupe/50 underline-offset-4 hover:text-taupe" href={waLink("Hi! I'd like to discuss a project.")} target="_blank" rel="noopener">
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label text-taupe">Email</dt>
                <dd className="mt-2">
                  <a className="underline decoration-taupe/50 underline-offset-4 hover:text-taupe" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label text-taupe">Studio</dt>
                <dd className="mt-2 text-ink">
                  {site.address[0]}
                  <br />
                  {site.address[1]}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
          <form
            noValidate
            className="grid gap-9"
            onSubmit={(ev) => {
              ev.preventDefault();
              const form = ev.currentTarget;
              const e = validate(form);
              setErrors(e);
              if (Object.keys(e).length) {
                (form.querySelector<HTMLInputElement>(`#${Object.keys(e)[0]}`))?.focus();
                return;
              }
              const d = Object.fromEntries(new FormData(form)) as Record<string, string>;
              const brief = [
                `New project enquiry for ${site.brand} Studio`,
                `Name: ${d.name}`,
                d.brand && `Brand: ${d.brand}`,
                `Phone: ${d.phone}`,
                `Service: ${d.service}`,
                `Budget: ${budget}`,
                d.message && `Brief: ${d.message}`,
              ]
                .filter(Boolean)
                .join("\n");
              // No backend needed: the brief lands in WhatsApp. Swap for a fetch() to your CRM if preferred.
              window.open(waLink(brief), "_blank", "noopener");
              setSent(true);
              form.reset();
            }}
            onInput={(ev) => {
              if (Object.keys(errors).length) setErrors(validate(ev.currentTarget));
            }}
          >
            <div className="grid gap-9 sm:grid-cols-2">
              <Field id="name" label="Your name" autoComplete="name" required error={errors.name} />
              <Field id="brand" label="Brand / store (optional)" autoComplete="organization" />
            </div>
            <Field id="phone" label="Mobile / WhatsApp" type="tel" inputMode="tel" autoComplete="tel" required error={errors.phone} />

            <div className="relative">
              <select id="service" name="service" defaultValue={services[0].title} className={`${inputCls} appearance-none pr-8`}>
                {services.map((s) => (
                  <option key={s.no}>
                    {s.title}
                  </option>
                ))}
                <option>Not sure yet</option>
              </select>
              <label htmlFor="service" className="label absolute top-0 left-0 text-taupe">
                What do you need?
              </label>
              <CaretDownIcon className="pointer-events-none absolute right-0 bottom-4 h-4 w-4 text-taupe" aria-hidden />
            </div>

            <fieldset>
              <legend className="label text-taupe">Budget</legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {BUDGETS.map((b) => (
                  <label
                    key={b}
                    className={`flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink ${
                      budget === b ? "border-ink bg-ink text-ivory" : "border-ink/20 text-ink/80 hover:border-ink/60"
                    }`}
                  >
                    <input type="radio" name="budget" value={b} checked={budget === b} onChange={() => setBudget(b)} className="sr-only" />
                    {b}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="relative">
              <textarea id="message" name="message" rows={3} placeholder="Tell us about the launch" className={`${inputCls} resize-none`} />
              <label htmlFor="message" className={labelCls}>
                Tell us about the launch (optional)
              </label>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <button
                type="submit"
                className="inline-flex min-h-13 items-center gap-3 rounded-full bg-ink px-7 py-3.5 text-base font-semibold text-ivory transition-[background-color,transform] hover:bg-onyx active:scale-[0.98]"
              >
                Send brief on WhatsApp
                <ArrowRightIcon weight="bold" className="h-4 w-4" aria-hidden />
              </button>
              <p role="status" className="text-sm text-taupe">
                {sent ? "Thanks! Your brief is ready in WhatsApp, just hit send." : "We reply within one working day."}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
