import Hero from "@/components/home/Hero";
import DurationPicker from "@/components/home/DurationPicker";
import PackagesShowcase from "@/components/home/PackagesShowcase";
import DestinationsRing from "@/components/home/DestinationsRing";
import WhyUs from "@/components/home/WhyUs";
import Moments from "@/components/home/Moments";
import CustomTripForm from "@/components/forms/CustomTripForm";

export default function Home() {
  return (
    <>
      <Hero />
      <DurationPicker />
      <PackagesShowcase />
      <DestinationsRing />
      <WhyUs />
      <Moments />
      <CustomTripForm />
    </>
  );
}
