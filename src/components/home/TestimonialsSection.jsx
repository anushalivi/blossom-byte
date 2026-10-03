'use client';

import { motion } from 'framer-motion';
import { Star, MessageSquare, CheckCircle2, Quote } from 'lucide-react';
import styles from './TestimonialsSection.module.css';

const REVIEWS = [
  {
    id: 1,
    name: 'Aarav & Priya M.',
    location: 'Mumbai',
    occasion: '5th Wedding Anniversary',
    rating: 5,
    date: 'Verified Patron',
    product: 'Blush Peony Royale',
    quote: 'The Blush Peony arrangement took my wife’s breath away. The peonies arrived in chilled hydration packaging and remained in glorious bloom for 9 full days! Blossom Byte is in a class of its own.'
  },
  {
    id: 2,
    name: 'Rohan Deshmukh',
    location: 'Bengaluru',
    occasion: 'Executive Birthday Gift',
    rating: 5,
    date: 'Verified Patron',
    product: 'Midnight Rose & Champagne Truffles',
    quote: 'Ordered the Midnight Rose gift combo for our company VP. The presentation, velvet wrapping, and personalized calligraphy note felt like something out of high-fashion Paris. Extraordinary.'
  },
  {
    id: 3,
    name: 'Dr. Sunita Rao',
    location: 'Delhi NCR',
    occasion: 'Penthouse Housewarming',
    rating: 5,
    date: 'Verified Patron',
    product: 'Velvet Orchid Terracotta Vessel',
    quote: 'Finding healthy, museum-grade Phalaenopsis orchids online is usually disappointing, but Blossom Byte delivered an architectural masterpiece. The live tracking gave me peace of mind.'
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <MessageSquare size={14} />
            <span>VERIFIED PATRON REVIEWS</span>
          </div>
          <h2 className={styles.title}>Cherished Across Celebrations</h2>
          <p className={styles.subtitle}>
            Read why over 12,000+ patrons trust Blossom Byte for life’s most pivotal declarations.
          </p>
        </div>

        <div className={styles.grid}>
          {REVIEWS.map((rev) => (
            <div key={rev.id} className={styles.reviewCard}>
              <div className={styles.cardTop}>
                <div className={styles.stars}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="#D4AF37" color="#D4AF37" />
                  ))}
                </div>
                <Quote size={24} className={styles.quoteIcon} />
              </div>

              <p className={styles.quoteText}>"{rev.quote}"</p>

              <div className={styles.reviewFooter}>
                <div className={styles.avatar}>
                  {rev.name.charAt(0)}
                </div>
                <div className={styles.reviewerInfo}>
                  <div className={styles.nameRow}>
                    <strong className={styles.reviewerName}>{rev.name}</strong>
                    <CheckCircle2 size={14} className={styles.verifiedIcon} title="Verified Buyer" />
                  </div>
                  <span className={styles.reviewerLocation}>{rev.location} &bull; {rev.occasion}</span>
                  <span className={styles.productTag}>Purchased: {rev.product}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
