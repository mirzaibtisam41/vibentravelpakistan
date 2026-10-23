"use client";

import { useRef, useState, type FormEvent } from "react";
import { Check, Phone, Send } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { site, tripForm } from "@/data/site";
import { generalWhatsapp, whatsappLink } from "@/lib/utils";
import { SplitHeading } from "@/components/ui/Reveal";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import TiltCard from "@/components/ui/TiltCard";

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const [f, setF] = useState({ name: "", phone: "", email: "", type: tripForm.inquiryTypes[0], message: "", consent: false });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
      gsap.from(".cs-card", { y: 70, rotateX: -15, opacity: 0, stagger: 0.12, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: "top 75%" } });
      gsap.from(".cs-left > p, .cs-left > div", { y: 30, opacity: 0, stagger: 0.1, scrollTrigger: { trigger: ref.current, start: "top 75%" } });
    },
    { scope: ref },
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() || !f.phone.trim() || !f.message.trim()) return setError("Please add your name, contact number and a short message.");
    if (!f.consent) return setError("Please agree that Vibe & Travel Pakistan may contact you about this inquiry.");
    setError("");
    const text = [
      `Hello Vibe & Travel Pakistan,`,
      ``,
      `Name: ${f.name}`,
      `Contact: ${f.phone}`,
      f.email ? `Email: ${f.email}` : null,
      `Inquiry type: ${f.type}`,
      ``,
      f.message,
    ]
      .filter((x) => x !== null)
      .join("\n");
    window.open(whatsappLink(text), "_blank", "noopener");
    setSent(true);
  };

  return (
    <section ref={ref} className="relative overflow-hidden bg-white py-24 sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="cs-left">
          <span className="eyebrow text-pine-700">Let’s Get You Out There</span>
          <SplitHeading className="heading-lg mt-4">
            Have a question? <span className="serif-accent text-pine-700">We’re listening.</span>
          </SplitHeading>
          <p className="mt-5 max-w-lg text-lg text-ink/70">
            Ask us about destinations, tour packages, accommodation, transport, or a journey you have in mind. We’ll help you figure out the next step.
          </p>

          <div className="perspective mt-10 grid gap-4 sm:grid-cols-2">
            <div className="cs-card">
              <TiltCard className="rounded-3xl">
                <a href={generalWhatsapp} target="_blank" rel="noreferrer" className="flex h-full flex-col justify-between gap-8 rounded-3xl bg-[#25D366] p-6 text-white">
                  <WhatsAppIcon className="size-9" />
                  <span>
                    <span className="block text-sm text-white/80">{site.phone}</span>
                    <span className="block text-xl font-extrabold">Chat on WhatsApp</span>
                  </span>
                </a>
              </TiltCard>
            </div>
            <div className="cs-card">
              <TiltCard className="rounded-3xl">
                <a href={site.instagram} target="_blank" rel="noreferrer" className="flex h-full flex-col justify-between gap-8 rounded-3xl bg-linear-to-br from-[#833ab4] via-[#e1306c] to-[#f7a95c] p-6 text-white">
                  <InstagramIcon className="size-9" />
                  <span>
                    <span className="block text-sm text-white/80">{site.instagramHandle}</span>
                    <span className="block text-xl font-extrabold">Follow us on Instagram</span>
                  </span>
                </a>
              </TiltCard>
            </div>
            <a href={`tel:+${site.phoneRaw}`} className="cs-card flex items-center gap-4 rounded-3xl border border-ink/8 bg-snow p-5 transition-colors hover:border-pine-700 sm:col-span-2">
              <span className="grid size-12 place-items-center rounded-2xl bg-pine-700 text-white">
                <Phone className="size-5" />
              </span>
              <span>
                <span className="block text-sm text-stone">Prefer to call?</span>
                <span className="block text-lg font-extrabold">{site.phone}</span>
              </span>
            </a>
          </div>
        </div>

        <div className="perspective">
          <form onSubmit={submit} noValidate className="cs-card rounded-[2rem] border border-ink/8 bg-snow p-6 sm:p-10">
            <p className="eyebrow text-glacier-700">Questions First. Adventure Next.</p>
            <h2 className="heading-md mt-3">Send us a message</h2>
            <p className="mt-2 text-stone">Fill in a few details and we’ll take it from there.</p>

            {sent ? (
              <div className="py-12 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-pine-700 text-white">
                  <Check className="size-7" />
                </span>
                <p className="mt-5 text-lg font-extrabold">Your message is waiting in WhatsApp. Just tap send.</p>
                <button type="button" onClick={() => setSent(false)} className="btn btn-outline mt-6 text-ink">
                  Send another message
                </button>
              </div>
            ) : (
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <label>
                  <span className="field-label">Full Name *</span>
                  <input className="field" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" />
                </label>
                <label>
                  <span className="field-label">Contact Number *</span>
                  <input className="field" type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} autoComplete="tel" />
                </label>
                <label>
                  <span className="field-label">Email Address</span>
                  <input className="field" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" />
                </label>
                <label>
                  <span className="field-label">Inquiry Type</span>
                  <select className="field" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
                    {tripForm.inquiryTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label className="sm:col-span-2">
                  <span className="field-label">Message *</span>
                  <textarea className="field min-h-36 resize-y" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
                </label>
                <label className="flex cursor-pointer items-start gap-3 text-sm sm:col-span-2">
                  <input type="checkbox" className="mt-0.5 size-5 shrink-0 accent-pine-700" checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} />
                  <span>
                    <span className="font-semibold">I agree that Vibe &amp; Travel Pakistan may contact me about this inquiry.</span>
                    <span className="mt-1 block text-xs text-stone">
                      Your information will be used to respond to your inquiry. Submitting this form does not confirm a booking.
                    </span>
                  </span>
                </label>
                {error && <p className="rounded-xl bg-alpen-400/15 px-4 py-3 text-sm font-semibold text-alpen-600 sm:col-span-2">{error}</p>}
                <button type="submit" className="btn btn-green sm:col-span-2">
                  Send Inquiry <Send className="size-4" />
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
