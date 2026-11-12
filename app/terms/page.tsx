import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `Terms | ${site.brand} Studio` };

export default function Terms() {
  return (
    <LegalPage
      title="Terms of service"
      updated="{{date}}"
      sections={[
        { heading: "About these terms", body: `These terms cover this website and the services of ${site.brand} Studio ({{registered business name}}). Each project also has its own written quote, which takes priority where the two differ.` },
        { heading: "Quotes and payment", body: "{{Deposit, payment schedule and accepted payment methods}}" },
        { heading: "Your jewellery", body: "{{How pieces are received, stored, insured and returned during a shoot}}" },
        { heading: "Usage rights", body: "{{Who owns the photos and films, and how each side may use them}}" },
        { heading: "Revisions and cancellations", body: "{{Revision rounds included, and the cancellation and rescheduling policy}}" },
        { heading: "Website content", body: `Images and text on this website belong to ${site.brand} Studio or are used with permission, and may not be reused without written consent.` },
      ]}
    />
  );
}
