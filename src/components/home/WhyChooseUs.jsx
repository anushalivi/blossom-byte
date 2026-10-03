'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Sparkles, HeartHandshake, Leaf, Award } from 'lucide-react';
import styles from './WhyChooseUs.module.css';

const PILLARS = [
  {
    icon: Leaf,
    title: 'Cold-Chain Farm Freshness',
    desc: 'Harvested at dawn and placed in temperature-controlled transit within 2 hours. Our stems never sit in stagnant warehouse air.',
    highlight: '12-Hour Harvest-to-Vase'
  },
  {
    icon: Sparkles,
    title: 'Certified Master Florists',
    desc: 'Every single arrangement is hand-composed by award-winning botanical stylists with surgical attention to balance, color, and scent.',
    highlight: 'Haute Floral Artistry'
  },
  {
    icon: Truck,
    title: '2-Hour Precision Delivery',
    desc: 'Delivered in customized hydration vessels with live courier GPS updates so your gift arrives exactly when anticipated.',
    highlight: 'Real-Time Tracking'
  },
  {
    icon: Award,
    title: '7-Day Bloom Guarantee',
    desc: 'We guarantee your blossoms stay radiant for at least 7 days. If your bouquet fades prematurely, we replace it instantly.',
    highlight: '100% Satisfaction'
  }
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.badge}>
            <ShieldCheck size={14} />
            <span>UNCOMPROMISING EXCELLENCE</span>
          </div>
          <h2 className={styles.title}>The Blossom Byte Standard</h2>
          <p className={styles.subtitle}>
            Why India's most discerning flower connoisseurs, luxury hotels, and celebrants choose Blossom Byte.
          </p>
        </div>

        <div className={styles.grid}>
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className={styles.pillarCard}>
                <div className={styles.iconCircle}>
                  <Icon size={26} />
                </div>
                <span className={styles.highlightBadge}>{pillar.highlight}</span>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                <p className={styles.pillarDesc}>{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
