"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Check, Minus, Phone, Plus, Send } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { site, tripForm } from "@/data/site";
import { cn, whatsappLink } from "@/lib/utils";
import { SplitHeading } from "@/components/ui/Reveal";

type Data = {
  name: string;
  phone: string;
  email: string;
  contactMethod: string;
  destinations: string[];
  otherDestination: string;
  tripType: string;
  duration: string;
  customDays: string;
  departDate: string;
  returnDate: string;
  flexible: boolean;
  adults: number;
  children: number;
  accommodation: string;
  transport: string;
  departureCity: string;
  pickup: string;
  budget: string;
  customBudget: string;
  activities: string;
  meals: string;
  accessibility: string;
  occasion: string;
  message: string;
  consent: boolean;
};

const steps = [
  { n: "01", title: "About you" },
  { n: "02", title: "Your kind of adventure" },
  { n: "03", title: "Your group & preferences" },
];

function Pills({ options, value, onChange, multi }: { options: string[]; value: string | string[]; onChange: (v: string) => void; multi?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = multi ? (value as string[]).includes(o) : value === o;
        return (
          <button type="button" key={o} onClick={() => onChange(o)} className="chip min-h-10! text-[13px]!" data-active={on} aria-pressed={on}>
            {on && <Check className="size-3.5" />}
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}

function Stepper({ label, value, min, onChange }: { label: string; value: number; min: number; onChange: (n: number) => void }) {
  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="flex h-[3.2rem] items-center justify-between rounded-[0.9rem] border-[1.5px] border-ink/12 bg-white px-2">
        <button type="button" aria-label={`Decrease ${label}`} onClick={() => onChange(Math.max(min, value - 1))} className="grid size-9 place-items-center rounded-full hover:bg-snow">
          <Minus className="size-4" />
        </button>
        <span className="text-lg font-extrabold tabular-nums">{value}</span>
        <button type="button" aria-label={`Increase ${label}`} onClick={() => onChange(value + 1)} className="grid size-9 place-items-center rounded-full hover:bg-snow">
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default function CustomTripForm({ defaultDestination }: { defaultDestination?: string }) {
  const ref = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [d, setD] = useState<Data>({
    name: "",
    phone: "",
    email: "",
    contactMethod: "WhatsApp",
    destinations: !defaultDestination
      ? []
      : tripForm.destinations.includes(defaultDestination)
        ? [defaultDestination]
        : ["Other Destination"],
    otherDestination: defaultDestination && !tripForm.destinations.includes(defaultDestination) ? defaultDestination : "",
    tripType: "",
    duration: "",
    customDays: "",
    departDate: "",
    returnDate: "",
    flexible: false,
    adults: 2,
    children: 0,
    accommodation: "",
    transport: "",
    departureCity: "",
    pickup: "",
    budget: "",
    customBudget: "",
    activities: "",
    meals: "",
    accessibility: "",
    occasion: "",
    message: "",
    consent: false,
  });

  const set = <K extends keyof Data>(k: K, v: Data[K]) => setD((s) => ({ ...s, [k]: v }));
  const toggleDest = (v: string) =>
    setD((s) => ({ ...s, destinations: s.destinations.includes(v) ? s.destinations.filter((x) => x !== v) : [...s.destinations, v] }));

  useGSAP(
    () => {
      gsap.from(".ctf-side > *", { y: 30, opacity: 0, stagger: 0.1, scrollTrigger: { trigger: ref.current, start: "top 75%" } });
      gsap.from(".ctf-card", { y: 80, rotateX: -12, opacity: 0, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: ".ctf-card", start: "top 85%" } });
    },
    { scope: ref },
  );

  const go = (next: number) => {
    setError("");
    if (next > step && step === 0) {
      if (!d.name.trim() || !d.phone.trim()) return setError("Please add your name and a WhatsApp or phone number so we can reach you.");
    }
    const dir = next > step ? 1 : -1;
    gsap.to(panel.current, {
      x: -60 * dir,
      rotateY: 12 * dir,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setStep(next);
        gsap.fromTo(panel.current, { x: 60 * dir, rotateY: -12 * dir, opacity: 0 }, { x: 0, rotateY: 0, opacity: 1, duration: 0.6, ease: "expo.out" });
      },
    });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (step < 2) return go(step + 1);
    if (!d.consent) return setError("Please agree that Vibe & Travel Pakistan may contact you about this inquiry.");
    const dest = [...d.destinations.filter((x) => x !== "Other Destination"), d.otherDestination].filter(Boolean).join(", ");
    const lines = [
      "Hello Vibe & Travel Pakistan, I would like a custom trip quote.",
      "",
      `Name: ${d.name}`,
      `Contact: ${d.phone}`,
      d.email && `Email: ${d.email}`,
      `Preferred contact: ${d.contactMethod}`,
      dest && `Destinations: ${dest}`,
      d.tripType && `Trip type: ${d.tripType}`,
      d.duration && `Duration: ${d.duration === "Custom Duration" ? `${d.customDays || "?"} days` : d.duration}`,
      (d.departDate || d.returnDate) && `Dates: ${d.departDate || "?"} → ${d.returnDate || "?"}`,
      d.flexible && "My dates are flexible",
      `Travellers: ${d.adults} adults, ${d.children} children`,
      d.accommodation && `Accommodation: ${d.accommodation}`,
      d.transport && `Transport: ${d.transport}`,
      d.departureCity && `Departure city: ${d.departureCity}`,
      d.pickup && `Pickup point: ${d.pickup}`,
      d.budget && `Budget: ${d.budget === "Custom Budget" ? d.customBudget : d.budget}`,
      d.activities && `Interests: ${d.activities}`,
      d.meals && `Meals / dietary: ${d.meals}`,
      d.accessibility && `Accessibility: ${d.accessibility}`,
      d.occasion && `Special occasion: ${d.occasion}`,
      d.message && `Message: ${d.message}`,
    ].filter(Boolean);
    window.open(whatsappLink(lines.join("\n")), "_blank", "noopener");
    setSent(true);
  };

  const travellers = d.adults + d.children;

  return (
    <section ref={ref} id="custom-trip-quote" className="relative scroll-mt-24 overflow-hidden bg-snow py-24 sm:py-32">
      <div className="pointer-events-none absolute -right-40 bottom-0 size-[34rem] rounded-full bg-glacier-300/25 blur-3xl" />
      <div className="container-x relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="ctf-side lg:sticky lg:top-28 lg:self-start">
          <span className="eyebrow text-pine-700">Made For Your Kind Of Wanderlust</span>
          <SplitHeading className="heading-lg mt-4">
            Plan Your <span className="serif-accent text-pine-700">Custom Trip.</span>
          </SplitHeading>
          <p className="mt-5 max-w-md text-lg text-ink/70">
            Tell us what your perfect escape looks like. We’ll help you work out the route, accommodation, transport, and budget before you decide.
          </p>
          <a href={`tel:+${site.phoneRaw}`} className="mt-8 flex items-center gap-4 rounded-2xl border border-ink/8 bg-white p-4 transition-colors hover:border-pine-700">
            <span className="grid size-12 place-items-center rounded-xl bg-pine-700 text-white">
              <Phone className="size-5" />
            </span>
            <span>
              <span className="block text-sm text-stone">Rather talk it through?</span>
              <span className="block text-lg font-extrabold">{site.phone}</span>
            </span>
          </a>
          <p className="mt-4 text-sm font-semibold text-pine-700">No commitment, just a conversation.</p>

          <ol className="mt-10 hidden space-y-1 lg:block">
            {steps.map((s, i) => (
              <li key={s.n}>
                <button
                  type="button"
                  onClick={() => (i < step ? go(i) : undefined)}
                  className={cn("flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition", i === step ? "bg-white shadow-sm" : "opacity-60")}
                >
                  <span
                    className={cn(
                      "grid size-9 place-items-center rounded-full text-xs font-extrabold",
                      i < step ? "bg-pine-700 text-white" : i === step ? "bg-alpen-400 text-night" : "bg-ink/8",
                    )}
                  >
                    {i < step ? <Check className="size-4" /> : s.n}
                  </span>
                  <span className="font-bold">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </aside>

        <div className="perspective">
          <form onSubmit={submit} className="ctf-card relative overflow-hidden rounded-[2rem] border border-ink/8 bg-white p-6 shadow-[0_40px_90px_-50px_rgba(6,29,21,.6)] sm:p-10" noValidate>
            {/* progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-pine-700">
                  Step {step + 1} of 3 · {steps[step].title}
                </span>
                <span className="text-stone">{Math.round(((step + 1) / 3) * 100)}%</span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/6">
                <div className="h-full rounded-full bg-linear-to-r from-pine-600 to-glacier-400 transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)]" style={{ width: `${((step + 1) / 3) * 100}%` }} />
              </div>
            </div>

            {sent ? (
              <div className="py-16 text-center">
                <span className="mx-auto grid size-16 place-items-center rounded-full bg-pine-700 text-white">
                  <Check className="size-8" />
                </span>
                <h3 className="heading-md mt-6">Your request is waiting in WhatsApp.</h3>
                <p className="mx-auto mt-3 max-w-md text-stone">
                  Just tap send. Our team will get back to you about the route, stays, transport and budget.
                </p>
                <button type="button" className="btn btn-outline mt-8" onClick={() => {
                    setSent(false);
                    setStep(0);
                  }}>
                  Start a new request
                </button>
              </div>
            ) : (
              <div ref={panel} className="preserve-3d">
                {step === 0 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full Name *">
                      <input className="field" value={d.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" required />
                    </Field>
                    <Field label="WhatsApp / Contact Number *">
                      <input className="field" type="tel" value={d.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" placeholder="+92 3xx xxxxxxx" required />
                    </Field>
                    <Field label="Email Address" className="sm:col-span-2">
                      <input className="field" type="email" value={d.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
                    </Field>
                    <div className="sm:col-span-2">
                      <span className="field-label">How should we contact you?</span>
                      <Pills options={tripForm.contactMethods} value={d.contactMethod} onChange={(v) => set("contactMethod", v)} />
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <span className="field-label">Where would you like to go? Pick as many as you like</span>
                      <Pills multi options={tripForm.destinations} value={d.destinations} onChange={toggleDest} />
                      {d.destinations.includes("Other Destination") && (
                        <input className="field mt-3" placeholder="Which destination?" value={d.otherDestination} onChange={(e) => set("otherDestination", e.target.value)} />
                      )}
                    </div>
                    <div>
                      <span className="field-label">Trip Type</span>
                      <Pills options={tripForm.tripTypes} value={d.tripType} onChange={(v) => set("tripType", v)} />
                    </div>
                    <div>
                      <span className="field-label">Trip Duration</span>
                      <Pills options={tripForm.durations} value={d.duration} onChange={(v) => set("duration", v)} />
                      {d.duration === "Custom Duration" && (
                        <input className="field mt-3 max-w-xs" type="number" min={1} placeholder="Custom Duration (Days)" value={d.customDays} onChange={(e) => set("customDays", e.target.value)} />
                      )}
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Preferred Departure Date">
                        <input className="field" type="date" value={d.departDate} onChange={(e) => set("departDate", e.target.value)} />
                      </Field>
                      <Field label="Preferred Return Date">
                        <input className="field" type="date" value={d.returnDate} onChange={(e) => set("returnDate", e.target.value)} />
                      </Field>
                    </div>
                    <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
                      <input type="checkbox" className="size-5 accent-pine-700" checked={d.flexible} onChange={(e) => set("flexible", e.target.checked)} />
                      My Dates Are Flexible
                    </label>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Stepper label="Adults" value={d.adults} min={1} onChange={(n) => set("adults", n)} />
                    <Stepper label="Children" value={d.children} min={0} onChange={(n) => set("children", n)} />
                    <p className="-mt-2 text-sm font-semibold text-pine-700 sm:col-span-2">
                      Group Size: {travellers} {travellers === 1 ? "Traveller" : "Travellers"}
                    </p>
                    <Field label="Accommodation Preference">
                      <select className="field" value={d.accommodation} onChange={(e) => set("accommodation", e.target.value)}>
                        <option value="">Select…</option>
                        {tripForm.accommodation.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Transport Preference">
                      <select className="field" value={d.transport} onChange={(e) => set("transport", e.target.value)}>
                        <option value="">Select…</option>
                        {tripForm.transport.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Departure City">
                      <input className="field" value={d.departureCity} onChange={(e) => set("departureCity", e.target.value)} placeholder="Lahore, Islamabad…" />
                    </Field>
                    <Field label="Pickup Point (Optional)">
                      <input className="field" value={d.pickup} onChange={(e) => set("pickup", e.target.value)} />
                    </Field>
                    <Field label="Approximate Budget (PKR)" className="sm:col-span-2">
                      <select className="field" value={d.budget} onChange={(e) => set("budget", e.target.value)}>
                        <option value="">Select…</option>
                        {tripForm.budget.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                      {d.budget === "Custom Budget" && (
                        <input className="field mt-3" placeholder="Your budget" value={d.customBudget} onChange={(e) => set("customBudget", e.target.value)} />
                      )}
                      <span className="mt-2 block text-xs text-stone">This is just a guide for us, not a confirmed quote.</span>
                    </Field>
                    <Field label="Activities & Interests">
                      <input className="field" value={d.activities} onChange={(e) => set("activities", e.target.value)} />
                    </Field>
                    <Field label="Meals / Dietary Preferences">
                      <input className="field" value={d.meals} onChange={(e) => set("meals", e.target.value)} />
                    </Field>
                    <Field label="Accessibility Needs">
                      <input className="field" value={d.accessibility} onChange={(e) => set("accessibility", e.target.value)} />
                    </Field>
                    <Field label="Special Occasions">
                      <input className="field" value={d.occasion} onChange={(e) => set("occasion", e.target.value)} />
                    </Field>
                    <Field label="Additional Message" className="sm:col-span-2">
                      <textarea className="field min-h-28 resize-y" value={d.message} onChange={(e) => set("message", e.target.value)} />
                    </Field>
                    <label className="flex cursor-pointer items-start gap-3 text-sm sm:col-span-2">
                      <input type="checkbox" className="mt-0.5 size-5 shrink-0 accent-pine-700" checked={d.consent} onChange={(e) => set("consent", e.target.checked)} />
                      <span>
                        <span className="font-semibold">I agree that Vibe &amp; Travel Pakistan may contact me about this inquiry.</span>
                        <span className="mt-1 block text-xs text-stone">
                          We only use your details to reply to this request. Sending it doesn’t book or confirm a trip.
                        </span>
                      </span>
                    </label>
                  </div>
                )}
              </div>
            )}

            {error && <p className="mt-5 rounded-xl bg-alpen-400/15 px-4 py-3 text-sm font-semibold text-alpen-600">{error}</p>}

            {!sent && (
              <div className="mt-8 flex items-center justify-between gap-3 border-t border-ink/8 pt-6">
                {step > 0 ? (
                  <button type="button" onClick={() => go(step - 1)} className="btn btn-outline">
                    <ArrowLeft className="size-4" /> Back
                  </button>
                ) : (
                  <span />
                )}
                <button type="submit" className={cn("btn", step === 2 ? "btn-primary" : "btn-green")}>
                  {step === 2 ? (
                    <>
                      Request My Custom Quote <Send className="size-4" />
                    </>
                  ) : (
                    <>
                      Continue <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
