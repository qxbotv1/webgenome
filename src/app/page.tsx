import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Problem from "@/components/Problem";
import HowItWorks from "@/components/HowItWorks";
import Products from "@/components/Products";
import UseCases from "@/components/UseCases";
import Pricing from "@/components/Pricing";
import Waitlist from "@/components/Waitlist";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustBar />
      <Problem />
      <HowItWorks />
      <Products />
      <UseCases />
      <Pricing />
      <Waitlist />
      <Footer />
    </main>
  );
}
