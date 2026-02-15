import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Countdown } from "@/components/countdown";
import { OurStory } from "@/components/our-story";
import { Details } from "@/components/details";
import { Gifts } from "@/components/gifts";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <section className="py-16 sm:py-20 px-4 bg-warm-white">
        <Countdown />
      </section>
      <OurStory />
      <Details />
      <Gifts />
    </div>
  );
}
