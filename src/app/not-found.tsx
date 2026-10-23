import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative grid min-h-svh place-items-center overflow-hidden bg-night px-4 text-center text-white">
      <Image src="/images/deosai.webp" alt="" fill sizes="100vw" className="object-cover opacity-30" />
      <div className="absolute inset-0 bg-linear-to-b from-night/60 to-night" />
      <div className="relative">
        <p className="text-[9rem] font-extrabold leading-none tracking-tighter text-white/10 sm:text-[14rem]">404</p>
        <h1 className="heading-lg -mt-10 sm:-mt-16">
          This trail <span className="serif-accent text-alpen-300">doesn’t exist.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-white/70">We couldn’t find that page. It may have moved, or the link might be wrong.</p>
        <Link href="/tour-packages" className="btn btn-primary mt-8">
          Explore Tour Packages <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
