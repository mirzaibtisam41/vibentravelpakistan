import packagesJson from "./packages.json";

export type ItineraryDay = { day: number; title: string; description: string };
export type PriceRow = { label: string; sub: string; amount: number | null };

export type TourPackage = {
  slug: string;
  name: string;
  duration: number;
  location: string;
  short: string;
  image: string;
  available: boolean;
  hiking: boolean;
  price: number;
  priceOld: number;
  couple: number | null;
  coupleOld: number | null;
  departure: string;
  transport: string;
  hotel: string;
  meals: string | null;
  overview: string;
  itinerary: ItineraryDay[];
  packIntro?: string;
  pack: string[];
  included: string[];
  excluded: string[];
  departures: { city: string; schedule: string }[];
  faqs: { q: string; a: string }[];
  pricing: PriceRow[];
};

export const packages = packagesJson as unknown as TourPackage[];

export const getPackage = (slug: string) => packages.find((p) => p.slug === slug);

export const durations = [1, 2, 3, 4, 5, 6, 8];

export const site = {
  name: "Vibe & Travel Pakistan",
  tagline: "For the places that stay with you.",
  taglineSub: "Explore Pakistan, one journey at a time.",
  phone: "+92 313 6295767",
  phoneRaw: "923136295767",
  instagram: "https://www.instagram.com/vibentravelpakistan/",
  instagramHandle: "@vibentravelpakistan",
  whatsappGroup: "https://chat.whatsapp.com/LMVfBQjGIDzFDls0ZfW66w?s=cl&p=i&mlu=4&ilr=4",
  founder: {
    name: "Ali Malik (Musafir Ali)",
    role: "Founder, Vibe & Travel Pakistan",
    image: "/images/founder.webp",
    instagram: "https://www.instagram.com/musafirrali/",
  },
  developer: { name: "Creator Ali", url: "https://www.instagram.com/creatorrali/" },
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "Tour Packages", href: "/tour-packages" },
  { label: "Destinations", href: "/destinations" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
];

export const heroSlides = [
  { name: "Hunza Valley", region: "Gilgit-Baltistan, Pakistan", image: "/images/hunza.webp" },
  { name: "Skardu & Deosai", region: "Gilgit-Baltistan, Pakistan", image: "/images/skardu.webp" },
  { name: "Fairy Meadows", region: "Gilgit-Baltistan, Pakistan", image: "/images/fairy-meadows.webp" },
  { name: "Kumrat Valley", region: "Upper Dir, Pakistan", image: "/images/kumrat.webp" },
  { name: "Neelum Valley", region: "Azad Kashmir, Pakistan", image: "/images/neelum.webp" },
];

export const destinations = [
  {
    name: "Hunza Valley",
    tag: "Lakes & Mountain Roads",
    image: "/images/hunza.webp",
    description: "Karakoram panoramas, turquoise Attabad Lake, and a slower pace in the mountains.",
  },
  {
    name: "Skardu",
    tag: "Alpine Lakes & Open Skies",
    image: "/images/skardu.webp",
    description: "A landscape of dramatic peaks, high-altitude lakes, and the wide Deosai Plains.",
  },
  {
    name: "Fairy Meadows",
    tag: "Trails & Alpine Escapes",
    image: "/images/fairy-meadows.webp",
    description: "Green meadows, forest trails, and unforgettable views of Nanga Parbat.",
  },
  {
    name: "Astore Valley",
    tag: "Hidden Alpine Meadows",
    image: "/images/astore.webp",
    description: "A quieter Karakoram valley leading to the remote Minimerg meadows.",
  },
  {
    name: "Minimerg",
    tag: "Remote Wildflower Plateau",
    image: "/images/astore.webp",
    description: "High-altitude meadows, wildflowers, and silence far from the main roads.",
  },
  {
    name: "Neelum Valley",
    tag: "Rivers & Hillside Villages",
    image: "/images/neelum.webp",
    description: "Azad Kashmir’s lush river gorge and the hilltop village of Arang Kel.",
  },
];

export const values = [
  {
    title: "A Journey Shaped Around You",
    text: "Choose your pace, your people, and the places you want to explore.",
  },
  {
    title: "Room for Every Travel Style",
    text: "Family trip, couple getaway, private tour, group or trek: tell us what suits you.",
  },
  {
    title: "A Real Conversation, First",
    text: "Talk to our team about costs, logistics and departure dates before you decide anything.",
  },
];

export const tripForm = {
  destinations: [
    "Hunza Valley",
    "Skardu",
    "Fairy Meadows",
    "Astore Valley",
    "Neelum Valley",
    "Naran & Kaghan",
    "Swat",
    "Kumrat Valley",
    "Mushkpuri Top",
    "Shogran & Siri Paye",
    "Not Sure Yet — Recommend a Destination",
    "Other Destination",
  ],
  tripTypes: ["Family", "Friends / Group", "Couple", "Private", "Adventure / Trekking", "Corporate / Team", "Other"],
  durations: ["1 Day", "2 Days", "3 Days", "4 Days", "5 Days", "6 Days", "7 Days", "8 Days", "Custom Duration"],
  accommodation: [
    "4–5 persons room sharing",
    "3 persons room sharing",
    "2 persons room sharing",
    "1 person room sharing",
    "Private / Custom",
    "Not Sure",
  ],
  transport: ["Shared", "Private Vehicle", "Family / Group Vehicle", "Not Sure", "Other"],
  budget: [
    "Not Sure",
    "Under 25,000 per person",
    "25,000–50,000 per person",
    "50,000–100,000 per person",
    "Over 100,000 per person",
    "Custom Budget",
  ],
  contactMethods: ["WhatsApp", "Phone Call", "Email"],
  inquiryTypes: [
    "General Question",
    "Tour Package Inquiry",
    "Custom Trip",
    "Existing Inquiry Follow-Up",
    "Group Travel",
    "Other",
  ],
};
