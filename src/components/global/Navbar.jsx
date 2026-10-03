'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, User, ShieldCheck, Menu, X, Sparkles, ChevronDown, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { NAV_SECTIONS } from '@/lib/navCategories';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState(null);
  const closeTimeoutRef = useRef(null);

  const { scrollY } = useScroll();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();

  const cartCount = cartItems ? cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0) : 0;
  const wishlistCount = wishlist ? wishlist.length : 0;

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const handleMouseEnter = (sectionId) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setActiveDropdown(sectionId);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const activeSectionData = NAV_SECTIONS.find(s => s.id === activeDropdown);

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <div className={styles.announcementBar}>
        <div className={styles.announcementContent}>
          <span className={styles.announcementBadge}><Sparkles size={12} /> FRESH HARVEST</span>
          <p className={styles.announcementText}>
            Handcrafted with love from eco-certified farms &bull; Same-day express delivery &bull; Free shipping over ₹1,499
          </p>
          <div className={styles.announcementLinks}>
            <Link href="/track-order" className={styles.announcementLink}>Track Order</Link>
            <span className={styles.announcementDot}>•</span>
            <Link href="/about" className={styles.announcementLink}>Our Story</Link>
          </div>
        </div>
      </div>

      <header 
        className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ''}`}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.container}>
          {/* Mobile Menu Toggle */}
          <button 
            className={styles.mobileToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Brand Logo */}
          <div className={styles.logoContainer}>
            <Link href="/" className={styles.logo}>
              <div className={styles.logoBadge}>
                <img 
                  src="/images/logos/primary_logo.png" 
                  alt="Blossom Byte Logo" 
                  className={styles.logoIcon} 
                />
              </div>
              <div className={styles.brandTextWrapper}>
                <span className={styles.logoText}>Blossom Byte</span>
                <span className={styles.logoSubtext}>Haute Botanica</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links with 7 Subcategories Dropdowns */}
          <nav className={styles.navLinks}>
            {NAV_SECTIONS.map((section) => {
              const isOpen = activeDropdown === section.id;
              return (
                <div 
                  key={section.id}
                  className={styles.navItemWrapper}
                  onMouseEnter={() => handleMouseEnter(section.id)}
                >
                  <Link 
                    href={`/category/${section.slug}`} 
                    className={`${styles.navLink} ${styles.navLinkWithDropdown}`}
                  >
                    <span>{section.name}</span>
                    <ChevronDown 
                      size={14} 
                      className={`${styles.chevronIcon} ${isOpen ? styles.chevronOpen : ''}`} 
                    />
                  </Link>
                </div>
              );
            })}

            <Link href="/products" className={`${styles.navLink} ${styles.navLinkHighlight}`}>
              All Products
            </Link>
          </nav>

          {/* Header Action Icons */}
          <div className={styles.actions}>
            {user?.isAdmin && (
              <Link href="/admin" className={styles.adminBadgeBtn} title="Admin Portal">
                <ShieldCheck size={16} />
                <span>Admin</span>
              </Link>
            )}

            <Link href="/products" className={styles.actionBtn} aria-label="Search Catalog" title="Search Flowers">
              <Search size={20} strokeWidth={1.75} />
            </Link>

            <Link href="/wishlist" className={styles.actionBtn} aria-label="Wishlist" title="Wishlist">
              <Heart size={20} strokeWidth={1.75} />
              {wishlistCount > 0 && (
                <span className={styles.badgeCount}>{wishlistCount}</span>
              )}
            </Link>

            <Link href="/cart" className={styles.actionBtn} aria-label="Cart" title="Shopping Cart">
              <ShoppingBag size={20} strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className={styles.badgeCount}>{cartCount}</span>
              )}
            </Link>

            <Link href={user ? "/profile" : "/login"} className={styles.actionBtn} aria-label="Account" title={user ? user.name : "Sign In"}>
              <User size={20} strokeWidth={1.75} />
            </Link>
          </div>
        </div>

        {/* Desktop 7-Subcategories Mega Menu Dropdown */}
        <AnimatePresence>
          {activeSectionData && (
            <motion.div 
              className={styles.megaMenu}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onMouseEnter={() => handleMouseEnter(activeSectionData.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className={styles.megaMenuHeader}>
                <div className={styles.megaMenuTitleGroup}>
                  <h3 className={styles.megaMenuTitle}>{activeSectionData.name} Collection</h3>
                  <p className={styles.megaMenuTagline}>{activeSectionData.tagline}</p>
                </div>
                <Link 
                  href={`/category/${activeSectionData.slug}`} 
                  className={styles.megaMenuViewAll}
                  onClick={() => setActiveDropdown(null)}
                >
                  <span>Explore All {activeSectionData.name}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Grid of the 7 Subcategories */}
              <div className={styles.subcatGrid}>
                {activeSectionData.subcategories.map((subcat) => (
                  <Link 
                    key={subcat.id} 
                    href={`/category/${activeSectionData.slug}?sub=${subcat.slug}`}
                    className={styles.subcatCard}
                    onClick={() => setActiveDropdown(null)}
                  >
                    <div className={styles.subcatThumbWrapper}>
                      <img 
                        src={subcat.image} 
                        alt={subcat.name} 
                        className={styles.subcatImage}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextSibling) {
                            e.currentTarget.nextSibling.style.display = 'flex';
                          }
                        }}
                      />
                      <span className={styles.subcatIconFallback} style={{ display: 'none' }}>
                        {subcat.icon}
                      </span>
                    </div>
                    <div className={styles.subcatInfo}>
                      <span className={styles.subcatTitle}>{subcat.name}</span>
                      <span className={styles.subcatDesc}>{subcat.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation Drawer with Accordion Subcategories */}
        {mobileMenuOpen && (
          <motion.div 
            className={styles.mobileDrawer}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className={styles.mobileNavGrid}>
              {NAV_SECTIONS.map((section) => {
                const isExpanded = mobileExpandedCat === section.id;
                return (
                  <div key={section.id} className={styles.mobileCategoryGroup}>
                    <button 
                      type="button"
                      className={styles.mobileCategoryHeader}
                      onClick={() => setMobileExpandedCat(isExpanded ? null : section.id)}
                    >
                      <span>{section.name} (7 Categories)</span>
                      <ChevronDown size={16} className={`${styles.chevronIcon} ${isExpanded ? styles.chevronOpen : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className={styles.mobileSubcatList}>
                        <Link 
                          href={`/category/${section.slug}`} 
                          className={styles.mobileSubcatItem}
                          style={{ fontWeight: 600, color: '#E91E63' }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span>🌸 Explore All {section.name}</span>
                        </Link>
                        {section.subcategories.map((subcat) => (
                          <Link 
                            key={subcat.id} 
                            href={`/category/${section.slug}?sub=${subcat.slug}`}
                            className={styles.mobileSubcatItem}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span className={styles.mobileSubcatIcon}>{subcat.icon}</span>
                            <span>{subcat.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <Link href="/products" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                <span>🛍️ View All Products</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/track-order" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                <span>📦 Track Order</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/about" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>
                <span>📖 About Blossom Byte</span>
                <ArrowRight size={16} />
              </Link>
              {user?.isAdmin && (
                <Link href="/admin" className={`${styles.mobileLink} ${styles.mobileAdminLink}`} onClick={() => setMobileMenuOpen(false)}>
                  <span>🛡️ Admin Control Panel</span>
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </header>
    </>
  );
}
