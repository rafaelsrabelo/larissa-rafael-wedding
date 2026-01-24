import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { OurStory } from "@/components/our-story";
import { Details } from "@/components/details";
import { RSVP } from "@/components/rsvp";
import { Gifts } from "@/components/gifts";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <OurStory />
      <Details />
      <RSVP />
      <Gifts />
      <Footer />
    </div>
  );
}
