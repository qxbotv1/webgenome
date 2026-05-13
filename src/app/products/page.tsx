import Products from "@/components/Products";
import Waitlist from "@/components/Waitlist";

export default function ProductsPage() {
  return (
    <main className="pt-16">
      <Products />
      <Waitlist />
    </main>
  );
}
