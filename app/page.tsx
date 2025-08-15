import { HeroSection } from '@/components/home/hero-section';
import { FeaturedEvent } from '@/components/home/featured-event';
import { FeaturedProject } from '@/components/home/featured-project';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedEvent />
      <FeaturedProject />
    </div>
  );
}
