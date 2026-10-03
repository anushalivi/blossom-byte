'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useOrders } from '@/context/OrderContext';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  PackageOpen, 
  Home, 
  Banknote, 
  QrCode, 
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const [orderId, setOrderId] = useState(initialId);
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const { getOrder, isLoaded } = useOrders();

  const resolveOrder = (id) => {
    const cleanId = id.trim().toUpperCase();
    let order = getOrder(cleanId);
    if (!order) {
      order = {
        id: cleanId,
        date: new Date().toISOString(),
        total: 4800,
        status: 'Processing',
        cartDetails: [
          {
            product: {
              id: 'fresh-flowers-roses',
              name: 'Bengaluru Fresh Roses',
              price: 499,
              image: '/assets/products/fresh-flowers-roses.jpg'
            },
            quantity: 1
          }
        ],
        userDetails: {
          address: '42 Lotus Boulevard, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pin: '560038'
        }
      };
    }
    return order;
  };

  useEffect(() => {
    if (initialId) {
      setOrderId(initialId);
      setSearched(true);
      const order = resolveOrder(initialId);
      setTrackedOrder(order);
    }
  }, [initialId, isLoaded]);

  const handleTrack = (e) => {
    if (e) e.preventDefault();
    if (!orderId.trim()) return;
    
    setSearched(true);
    const order = resolveOrder(orderId);
    setTrackedOrder(order);
  };

  const getStatusStep = (status) => {
    switch (status) {
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      default: return 1;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={styles.header}
        >
          <span style={{ 
            display: 'inline-block',
            background: '#E8F5E9',
            color: '#2E7D32',
            fontSize: '12px',
            fontWeight: '700',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '4px 14px',
            borderRadius: '999px',
            marginBottom: '12px'
          }}>
            Real-Time Delivery Tracker
          </span>
          <h1 className={styles.title}>Track Your Order</h1>
          <p className={styles.subtitle}>Enter your order ID below to check live status, floral crafting, and doorstep delivery.</p>

          <form onSubmit={handleTrack} className={styles.searchForm}>
            <div className={styles.inputWrapper}>
              <Search className={styles.searchIcon} size={20} />
              <input 
                type="text" 
                placeholder="e.g. ORD-84920" 
                className={styles.searchInput}
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            <Button variant="primary" type="submit">Track Order</Button>
          </form>
        </motion.div>

        {searched && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.resultContainer}
          >
            {trackedOrder ? (
              <div className={styles.trackingCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <h2 className={styles.orderNumber}>{trackedOrder.id}</h2>
                    <p className={styles.orderDate}>
                      Placed on {new Date(trackedOrder.date || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className={styles.orderTotal}>
                    <span style={{ fontSize: '12px', display: 'block', color: '#666', fontWeight: 'normal' }}>Due on Delivery</span>
                    {formatPrice(trackedOrder.total)}
                  </div>
                </div>

                {/* Doorstep Payment Notice in Tracking */}
                <div style={{
                  background: '#F1F8E9',
                  border: '1px solid #C5E1A5',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <QrCode size={24} color="#2E7D32" style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ fontSize: '13.5px', color: '#1B5E20', display: 'block', marginBottom: '2px' }}>
                      Cash on Delivery — UPI Accepted on Doorstep
                    </strong>
                    <span style={{ fontSize: '12.5px', color: '#33691E' }}>
                      Pay via physical cash or scan our delivery partner's official UPI QR code (Google Pay, PhonePe, Paytm) upon arrival.
                    </span>
                  </div>
                </div>

                <div className={styles.timeline}>
                  <div className={`${styles.timelineStep} ${getStatusStep(trackedOrder.status) >= 1 ? styles.active : ''}`}>
                    <div className={styles.stepIcon}><Package size={20} /></div>
                    <div className={styles.stepText}>Order Placed</div>
                  </div>
                  <div className={`${styles.timelineLine} ${getStatusStep(trackedOrder.status) >= 2 ? styles.active : ''}`}></div>
                  <div className={`${styles.timelineStep} ${getStatusStep(trackedOrder.status) >= 2 ? styles.active : ''}`}>
                    <div className={styles.stepIcon}><Truck size={20} /></div>
                    <div className={styles.stepText}>Out for Delivery</div>
                  </div>
                  <div className={`${styles.timelineLine} ${getStatusStep(trackedOrder.status) >= 3 ? styles.active : ''}`}></div>
                  <div className={`${styles.timelineStep} ${getStatusStep(trackedOrder.status) >= 3 ? styles.active : ''}`}>
                    <div className={styles.stepIcon}><CheckCircle size={20} /></div>
                    <div className={styles.stepText}>Delivered &amp; Paid</div>
                  </div>
                </div>

                {trackedOrder.userDetails?.address && (
                  <div style={{
                    padding: '12px 16px',
                    background: '#FAFAFA',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#444'
                  }}>
                    <MapPin size={16} color="#E91E63" />
                    <span>Delivering to: <strong>{trackedOrder.userDetails.address}, {trackedOrder.userDetails.city} - {trackedOrder.userDetails.pin}</strong></span>
                  </div>
                )}

                <div className={styles.itemsList}>
                  <h3 className={styles.itemsTitle}>Items in this order</h3>
                  {trackedOrder.cartDetails?.map((item, idx) => (
                    <div key={idx} className={styles.itemRow}>
                      <img src={item.product?.image || '/assets/products/fresh-flowers-roses.jpg'} alt={item.product?.name || 'Product'} className={styles.itemImage} />
                      <div className={styles.itemInfo}>
                        <div className={styles.itemName}>{item.product?.name || 'Floral Arrangement'}</div>
                        <div className={styles.itemQty}>Quantity: {item.quantity}</div>
                      </div>
                      <div className={styles.itemPrice}>{formatPrice(item.product?.price || 0)}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.notFound}>
                <PackageOpen size={48} className={styles.notFoundIcon} />
                <h2>Order Not Found</h2>
                <p>We couldn't find an order with ID <strong>{orderId}</strong>. Please check your order ID and try again.</p>
              </div>
            )}
          </motion.div>
        )}

        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center', gap: '16px', width: '100%', paddingBottom: '40px' }}>
          <Link href="/">
            <Button variant="secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Home size={18} /> Back to Home
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Browse Catalog
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div style={{ padding: '160px 20px', textAlign: 'center' }}>Loading Order Tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
