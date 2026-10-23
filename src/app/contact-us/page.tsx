import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowDown } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import ContactSection from "@/components/forms/ContactSection";
import CustomTripForm from "@/components/forms/CustomTripForm";
import PrefilledTripForm from "./PrefilledTripForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Vibe & Travel Pakistan to plan your next adventure. Ask about Pakistan tour packages, departure dates, group trips, or request a custom itinerary.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        image="/images/hunza.webp"
        imageAlt="Dramatic Karakoram mountains and turquoise Hunza Lake"
        eyebrow="Contact Us"
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
        title={
          <>
            Let’s Plan Your <span className="serif-accent text-glacier-300">Next Adventure.</span>
          </>
        }
        text="Have questions about our Pakistan tour packages? Tell us where you want to go, when you want to travel, and what kind of experience you have in mind."
      >
        <a href="#custom-trip-quote" className="btn btn-primary">
          Plan a Custom Trip <ArrowDown className="size-4" />
        </a>
      </PageHero>
      <ContactSection />
      <Suspense fallback={<CustomTripForm />}>
        <PrefilledTripForm />
      </Suspense>
    </>
  );
}
