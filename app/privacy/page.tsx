import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `Privacy policy | ${site.brand} Studio` };

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy policy"
      updated="{{date}}"
      sections={[
        { heading: "Who we are", body: `${site.brand} Studio ({{registered business name}}), ${site.address.join(", ")}. Contact: ${site.email}.` },
        { heading: "What we collect", body: "When you send a brief, we receive the details you type: your name, brand, phone number, the service you need, your budget range and your message. The brief is sent through WhatsApp, so WhatsApp's own privacy policy also applies to that conversation." },
        { heading: "How we use it", body: "Only to reply to your enquiry, prepare a quote and run the project you book. {{Any other uses, for example newsletters, and how people opt in}}" },
        { heading: "How long we keep it", body: "{{Retention period}}" },
        { heading: "Cookies and analytics", body: "{{Which analytics or cookies the site uses, if any}}" },
        { heading: "Your rights", body: `You can ask to see, correct or delete the personal details we hold about you by writing to ${site.email}.` },
      ]}
    />
  );
}
