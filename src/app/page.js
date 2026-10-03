'use client';

import LandingHero from '@/components/home/LandingHero';
import SectionNavigator from '@/components/home/SectionNavigator';
import CollectionsGrid from '@/components/home/CollectionsGrid';
import BestSellersSection from '@/components/home/BestSellersSection';
import CuratedPurpose from '@/components/home/CuratedPurpose';
import OccasionFinder from '@/components/home/OccasionFinder';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import TrackOrderPreview from '@/components/home/TrackOrderPreview';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Floating Interactive Section Navigator */}
      <SectionNavigator />

      {/* 1. Hero Section with Quick Jump & Featured Cards */}
      <LandingHero />

      {/* 2. All 6 Collections Gateway (Direct navigation to every category) */}
      <CollectionsGrid />

      {/* 3. Best Sellers & Client Favorites */}
      <BestSellersSection />

      {/* 4. Curated With Purpose (Editorial Showcase) */}
      <CuratedPurpose />

      {/* 5. Shop by Occasion & Mood */}
      <OccasionFinder />

      {/* 6. Why Discerning Clients Choose Blossom Byte */}
      <WhyChooseUs />

      {/* 7. Express Order Tracking & Dispatch */}
      <TrackOrderPreview />

      {/* 8. Verified Patron Reviews & Testimonials */}
      <TestimonialsSection />
    </main>
  );
}
