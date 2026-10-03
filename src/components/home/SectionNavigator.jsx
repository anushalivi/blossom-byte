'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Layers, 
  Star, 
  HeartHandshake, 
  Gift, 
  ShieldCheck, 
  Truck, 
  MessageSquare,
  ArrowUp
} from 'lucide-react';
import styles from './SectionNavigator.module.css';

const SECTIONS = [
  { id: 'hero', label: 'Top', icon: Sparkles },
  { id: 'collections', label: 'All 6 Collections', icon: Layers },
  { id: 'best-sellers', label: 'Best Sellers', icon: Star },
  { id: 'curated', label: 'Curated Purpose', icon: HeartHandshake },
  { id: 'occasions', label: 'By Occasion', icon: Gift },
  { id: 'why-us', label: 'Why Blossom', icon: ShieldCheck },
  { id: 'track-order', label: 'Track Order', icon: Truck },
  { id: 'testimonials', label: 'Reviews', icon: MessageSquare },
];

export default function SectionNavigator() {
  const [activeSection, setActiveSection] = useState('hero');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      setVisible(window.scrollY > 250);

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  if (!visible) return null;

  return (
    <aside className={styles.dockWrapper} aria-label="Website Section Navigation">
      <div className={styles.dock}>
        <div className={styles.dockTitle}>Jump to Section</div>
        <div className={styles.itemsList}>
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={(e) => scrollToSection(e, sec.id)}
                className={`${styles.dockItem} ${isActive ? styles.dockItemActive : ''}`}
                title={sec.label}
                aria-label={`Jump to ${sec.label}`}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 1.75} />
                <span className={styles.tooltip}>{sec.label}</span>
              </button>
            );
          })}
        </div>
        <div className={styles.divider}></div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={styles.backToTop}
          title="Back to Top"
          aria-label="Back to Top"
        >
          <ArrowUp size={15} />
        </button>
      </div>
    </aside>
  );
}
