import Analytics from "@/components/home/Analytics";
import FAQ from "@/components/home/FAQ";
import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import Testimonials from "@/components/home/Testimonials";
import HomeLayout from "@/layouts/HomeLayout";

export default function Home() {
  return (
    <div>
      <HomeLayout>
        <Hero />
        <Features />
        <Analytics />
        <Testimonials/>
        <FAQ />
      </HomeLayout>
    </div>
  );
}
