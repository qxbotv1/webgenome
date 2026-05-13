import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Problem from "@/components/Problem";
import HowItWorks from "@/components/HowItWorks";
import Waitlist from "@/components/Waitlist";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <Problem />
      <HowItWorks />
      <Waitlist />
    </main>
  );
}
