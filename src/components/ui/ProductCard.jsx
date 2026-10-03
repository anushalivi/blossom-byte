'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import Badge from './Badge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { hasValidProductImage } from '@/lib/validImages';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, delay = 0 }) {
  const [imageFailed, setImageFailed] = useState(false);
  const { addToCart, cartItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // STRICT RULE: If product has no valid image or image fails to load, do not render card
  if (!product || !hasValidProductImage(product) || imageFailed) {
    return null;
  }

  const inCart = cartItems ? cartItems.some(item => item.product.id === product.id) : false;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const discountedPrice = product.discount 
    ? product.price - (product.price * (product.discount / 100))
    : null;

  return (
    <div className={styles.card}>
      <Link href={`/products/${product.slug}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <img 
            src={product.image} 
            alt={product.name} 
            className={styles.image} 
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
          
          <div className={styles.badges}>
            {product.discount > 0 && <Badge variant="primary">-{product.discount}%</Badge>}
            {product.bestSeller && <Badge variant="accent">Best Seller</Badge>}
          </div>

          <div className={styles.actions}>
            <button 
              className={styles.actionBtn} 
              aria-label="Add to wishlist" 
              onClick={(e) => { 
                e.preventDefault(); 
                toggleWishlist(product);
              }}
              style={isInWishlist && isInWishlist(product.id) ? { color: '#E91E63', background: 'rgba(233, 30, 99, 0.1)' } : {}}
            >
              <Heart size={18} strokeWidth={1.5} fill={isInWishlist && isInWishlist(product.id) ? '#E91E63' : 'none'} />
            </button>
            <button 
              className={styles.actionBtn} 
              aria-label="Add to cart" 
              onClick={(e) => { 
                e.preventDefault(); 
                if (!inCart) addToCart(product, 1);
              }}
              style={inCart ? { color: '#333333', background: 'rgba(0, 0, 0, 0.05)' } : {}}
            >
              <ShoppingBag size={18} strokeWidth={1.5} fill={inCart ? '#333333' : 'none'} />
            </button>
          </div>
        </div>
      </Link>

      <div className={styles.content}>
        <Link href={`/products/${product.slug}`} className={styles.titleLink}>
          <h3 className={styles.title}>{product.name}</h3>
        </Link>
        <p className={styles.desc}>{product.shortDesc}</p>
        
        <div className={styles.priceContainer}>
          {discountedPrice ? (
            <>
              <span className={styles.price}>{formatPrice(discountedPrice)}</span>
              <span className={styles.originalPrice}>{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className={styles.price}>{formatPrice(product.price)}</span>
          )}
        </div>

        <button
          type="button"
          className={`${styles.addToCartBtn} ${inCart ? styles.addToCartBtnInCart : ''}`}
          onClick={(e) => {
            e.preventDefault();
            addToCart(product, 1);
          }}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingBag size={16} />
          <span>{inCart ? 'Added to Cart ✓' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
}
