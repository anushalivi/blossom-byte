'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Truck, Search, MapPin, CheckCircle2, Clock } from 'lucide-react';
import styles from './TrackOrderPreview.module.css';

export default function TrackOrderPreview() {
  const router = useRouter();
  const [orderQuery, setOrderQuery] = useState('');

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    router.push(`/track-order?id=${encodeURIComponent(orderQuery.trim())}`);
  };

  return (
    <section id="track-order" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.contentCol}>
            <div className={styles.badge}>
              <Truck size={14} />
              <span>LIVE COLD-CHAIN DISPATCH</span>
            </div>
            <h2 className={styles.title}>Track Your Blossom Delivery</h2>
            <p className={styles.desc}>
              Have an active order? Enter your Order ID below to see live climate-controlled vehicle progress, 
              courier contact, and estimated arrival down to the minute.
            </p>

            <form onSubmit={handleTrackSubmit} className={styles.form}>
              <div className={styles.inputWrapper}>
                <Search size={18} className={styles.searchIcon} />
                <input 
                  type="text" 
                  value={orderQuery} 
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="e.g. ORD-17290001 or Email..." 
                  className={styles.input}
                  aria-label="Order Tracking ID"
                />
              </div>
              <button type="submit" className={styles.trackBtn}>
                Track Live &rarr;
              </button>
            </form>

            <div className={styles.featuresRow}>
              <div className={styles.featItem}>
                <Clock size={15} className={styles.featIcon} />
                <span>2-Hour Delivery Slots</span>
              </div>
              <div className={styles.featItem}>
                <MapPin size={15} className={styles.featIcon} />
                <span>Active in 24+ Major Cities</span>
              </div>
              <div className={styles.featItem}>
                <CheckCircle2 size={15} className={styles.featIcon} />
                <span>Photo Proof Upon Handover</span>
              </div>
            </div>
          </div>

          <div className={styles.visualCol}>
            <div className={styles.mockTimeline}>
              <div className={styles.timelineItem}>
                <div className={`${styles.timelineDot} ${styles.dotDone}`}></div>
                <div className={styles.timelineText}>
                  <strong>Harvested &amp; Hydrated</strong>
                  <span>Morning harvest at peak bloom</span>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={`${styles.timelineDot} ${styles.dotDone}`}></div>
                <div className={styles.timelineText}>
                  <strong>Artisan Hand-Tied</strong>
                  <span>Bespoke ribbon and card arranged</span>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={`${styles.timelineDot} ${styles.dotActive}`}></div>
                <div className={styles.timelineText}>
                  <strong>In Chilled Transit</strong>
                  <span>Express courier dispatched</span>
                </div>
              </div>
              <div className={styles.timelineItem}>
                <div className={styles.timelineDot}></div>
                <div className={styles.timelineText}>
                  <strong>Doorstep Handover</strong>
                  <span>Presented in signature gift tote</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
