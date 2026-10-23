import type { Metadata, Viewport } from "next";
import { Manrope, Instrument_Serif } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import Preloader from "@/components/layout/Preloader";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vibentravelpakistan.com"),
  title: {
    default: "Vibe & Travel Pakistan | Discover Pakistan",
    template: "%s | Vibe & Travel Pakistan",
  },
  description:
    "Explore Pakistan with Vibe & Travel Pakistan. Discover northern mountain destinations, scenic road trips, trekking adventures, group tours, and custom travel experiences.",
  icons: { icon: "/images/logo.png", apple: "/images/logo.png" },
  openGraph: {
    title: "Vibe & Travel Pakistan | Discover Pakistan",
    description: "Extraordinary places, unforgettable journeys. Discover Pakistan your way.",
    images: ["/images/hunza.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#025F32",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${instrument.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script
          // Runs before paint so returning visitors never see the intro overlay flash.
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("vt-visited"))document.documentElement.dataset.visited="1"}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen">
        <Preloader />
        <SmoothScroll />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
