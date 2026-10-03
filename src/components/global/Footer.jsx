'use client';

import Link from 'next/link';
import styles from './Footer.module.css';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Home, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={styles.topSection}
        >
          <div className={styles.brand}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <img src="/images/logos/primary_logo.png" alt="Blossom Byte" className={styles.logo} />
              <span style={{ fontFamily: 'var(--font-primary, serif)', fontSize: '20px', fontWeight: '800', color: '#1c1917' }}>Blossom Byte</span>
            </div>
            <p className={styles.tagline}>
              Haute floristry and botanical experiences. Handcrafted fresh arrangements delivered with speed, elegance, and cold-chain perfection.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <Link href="/track-order" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#E91E63', fontWeight: '600' }}>
                <Truck size={15} /> Track Active Order
              </Link>
            </div>
          </div>
          
          <div className={styles.linksGrid}>
            <div className={styles.linkGroup}>
              <h4>Collections</h4>
              <Link href="/category/fresh-flowers">Fresh Flowers</Link>
              <Link href="/category/bouquets">Flower Bouquets</Link>
              <Link href="/category/plants">Flower Plants</Link>
              <Link href="/category/seeds">Flower Seeds</Link>
              <Link href="/category/decor">Decoration Flowers</Link>
              <Link href="/category/gift-combos">Gift Combos</Link>
            </div>
            
            <div className={styles.linkGroup}>
              <h4>Navigation</h4>
              <Link href="/products">All 70+ Products</Link>
              <Link href="/categories">All Collections</Link>
              <Link href="/track-order">Track Your Order</Link>
              <Link href="/cart">Shopping Cart</Link>
              <Link href="/wishlist">Saved Wishlist</Link>
              <Link href="/about">About Our Farms</Link>
            </div>
            
            <div className={styles.linkGroup}>
              <h4>Account &amp; Admin</h4>
              <Link href="/profile">Customer Profile</Link>
              <Link href="/orders">Order History</Link>
              <Link href="/login">Patron Login</Link>
              <Link href="/register">Create Account</Link>
              <Link href={user?.isAdmin ? "/admin" : "/login"} style={{ color: '#E91E63', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> Admin Portal
              </Link>
            </div>
          </div>
        </motion.div>
        
        <div className={styles.bottomSection}>
          <p>&copy; {new Date().getFullYear()} Blossom Byte Haute Floristry. All rights reserved. Database: Neon PostgreSQL.</p>
          <div className={styles.socials}>
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="Pinterest">Pinterest</a>
            <a href="#" aria-label="WhatsApp">WhatsApp Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
