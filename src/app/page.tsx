import Analytics from "@/components/home/Analytics";
import FAQ from "@/components/home/FAQ";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <Analytics/>
      <FAQ/>
    </div>
  );
}
