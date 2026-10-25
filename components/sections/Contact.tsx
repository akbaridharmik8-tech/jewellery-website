"use client";

import { useState } from "react";
import { services, site, waLink } from "@/lib/site";
import { MaskLines, Reveal, SectionLabel } from "@/components/ui/Reveal";

const BUDGETS = ["Under ₹50k", "₹50k to ₹2L", "₹2L to ₹5L", "₹5L+"];

type Errors = Partial<Record<"name" | "phone", string>>;

const inputCls =
  "peer w-full border-0 border-b border-ivory/25 bg-transparent px-0 pt-6 pb-3 text-[17px] text-ivory placeholder-transparent transition-colors focus:border-gold focus:ring-0 focus:outline-none aria-[invalid=true]:border-[#e7a3ad]";
const labelCls =
  "pointer-events-none absolute top-0 left-0 text-[12px] font-semibold tracking-[0.14em] text-mist uppercase transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-[16px] peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:normal-case peer-focus:top-0 peer-focus:text-[12px] peer-focus:font-semibold peer-focus:tracking-[0.14em] peer-focus:uppercase";

function Field({ id, label, error, ...rest }: { id: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <input id={id} name={id} placeholder={label} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={inputCls} {...rest} />
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      {error && (
        <p id={`${id}-err`} className="mt-2 text-[13px] text-[#f0b8c0]">
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
    if (digits.length < 10 || digits.length > 13) e.phone = "Enter a 10-digit mobile number so we can call back.";
    return e;
  }

  return (
    <section id="contact" data-header="dark" className="grain relative bg-emerald py-[clamp(88px,11vw,160px)] text-ivory">
      <div className="container-x grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel no="07" dark>
            Start a project
          </SectionLabel>
          <h2 className="display mt-6 text-[clamp(2.8rem,6vw,6rem)]">
            <MaskLines lines={["Let’s make it", <em key="e" className="text-gold">impossible</em>, "to scroll past."]} />
          </h2>
          <Reveal>
            <dl className="mt-12 grid gap-6 text-[15px] sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <dt className="label text-mist">WhatsApp / call</dt>
                <dd className="mt-2">
                  <a className="underline decoration-gold/50 underline-offset-4 hover:text-gold" href={waLink("Hi! I'd like to discuss a project.")} target="_blank" rel="noopener">
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label text-mist">Email</dt>
                <dd className="mt-2">
                  <a className="underline decoration-gold/50 underline-offset-4 hover:text-gold" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label text-mist">Studio</dt>
                <dd className="mt-2 text-ivory/85">
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
                  <option key={s.no} className="bg-emerald text-ivory">
                    {s.title}
                  </option>
                ))}
                <option className="bg-emerald text-ivory">Not sure yet</option>
              </select>
              <label htmlFor="service" className="label absolute top-0 left-0 text-mist">
                What do you need?
              </label>
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute right-0 bottom-4 h-4 w-4 text-gold" aria-hidden>
                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>

            <fieldset>
              <legend className="label text-mist">Budget</legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {BUDGETS.map((b) => (
                  <label
                    key={b}
                    className={`flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold ${
                      budget === b ? "border-gold bg-gold text-emerald" : "border-ivory/25 text-ivory/80 hover:border-gold/60"
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
                className="inline-flex min-h-13 items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-[15px] font-semibold text-emerald transition-[background-color,transform] hover:bg-ivory active:scale-[0.98]"
              >
                Send brief on WhatsApp
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <p role="status" className="text-sm text-mist">
                {sent ? "Thanks! Your brief is ready in WhatsApp, just hit send." : "We reply within one working day."}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
