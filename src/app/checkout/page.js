'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { CheckCircle2, Banknote, Truck, ShieldCheck, QrCode } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from './page.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, total, subtotal, gst, delivery, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const paymentMethod = 'cod';

  const [formData, setFormData] = useState({
    firstName: user?.name ? user.name.split(' ')[0] : '',
    lastName: (user?.name && user.name.split(' ')[1]) || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.addresses?.[0]?.address || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    pin: user?.addresses?.[0]?.pin || ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate order placement
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const finalTotal = total - discountAmount;
    const orderPayload = {
      ...formData,
      paymentMethod: 'Cash on Delivery (Cash or UPI at Doorstep)',
      paymentStatus: 'Pending (Pay on Delivery)'
    };
    const orderId = await placeOrder(cartItems, finalTotal, orderPayload);
    
    setIsSuccess(true);
    clearCart();
    setIsProcessing(false);
    router.push(`/order-success?id=${orderId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'WELCOME10') {
      setDiscountAmount(subtotal * 0.10);
    } else {
      setDiscountAmount(0);
      alert('Invalid coupon code');
    }
  };

  const displayItems = cartItems && cartItems.length > 0 ? cartItems : [
    {
      product: {
        id: 'classic-red-rose',
        name: 'Classic Red Rose Bouquet',
        price: 1299,
        image: '/assets/products/bouquets-classic-red-rose.jpg'
      },
      quantity: 1
    }
  ];
  const displaySubtotal = cartItems && cartItems.length > 0 ? subtotal : 4800;
  const displayGst = cartItems && cartItems.length > 0 ? gst : Math.round(4800 * 0.18);
  const displayDelivery = delivery || 0;
  const calculatedTotal = displaySubtotal + displayGst + displayDelivery;
  const finalTotal = Math.max(0, calculatedTotal - discountAmount);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Secure Checkout</h1>
        
        <form onSubmit={handleSubmit} className={styles.layout}>
          <div className={styles.checkoutForm}>
            
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Contact Information</h2>
              <div className={styles.grid}>
                <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required />
                <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Shipping Address</h2>
              <Input label="Street Address" name="address" value={formData.address} onChange={handleChange} required className={styles.fullWidth} />
              <div className={styles.grid}>
                <Input label="City" name="city" value={formData.city} onChange={handleChange} required />
                <Input label="State" name="state" value={formData.state} onChange={handleChange} required />
                <Input label="PIN Code" name="pin" value={formData.pin} onChange={handleChange} required />
                <Input label="Country" defaultValue="India" disabled />
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Payment Method</h2>
              
              <div className={styles.codCard}>
                <div className={styles.codCardHeader}>
                  <div className={styles.codTitleGroup}>
                    <div className={styles.codRadioActive}>
                      <div className={styles.codRadioInner}></div>
                    </div>
                    <div className={styles.codIconWrap}>
                      <Banknote size={22} color="#2E7D32" />
                    </div>
                    <div>
                      <h3 className={styles.codTitle}>Cash on Delivery (COD)</h3>
                      <p className={styles.codSub}>No advance online payment required</p>
                    </div>
                  </div>
                  <span className={styles.codPill}>Doorstep Pay</span>
                </div>

                <div className={styles.codBanner}>
                  <div className={styles.codBannerHeader}>
                    <QrCode size={18} className={styles.qrIcon} />
                    <strong className={styles.codNoticeTitle}>
                      UPI accepted once order received on your doorstep — Pay to delivery person
                    </strong>
                  </div>
                  <p className={styles.codNoticeDesc}>
                    When our delivery executive arrives at your doorstep with your fresh floral arrangement, you can conveniently pay in physical <strong>Cash</strong> or scan their official <strong>UPI QR code</strong> using Google Pay, PhonePe, Paytm, or BHIM.
                  </p>
                </div>

                <div className={styles.codPerks}>
                  <div className={styles.perk}>
                    <CheckCircle2 size={16} color="#2E7D32" />
                    <span>Inspect fresh flowers upon arrival</span>
                  </div>
                  <div className={styles.perk}>
                    <ShieldCheck size={16} color="#2E7D32" />
                    <span>Safe &amp; contactless UPI accepted</span>
                  </div>
                  <div className={styles.perk}>
                    <Truck size={16} color="#2E7D32" />
                    <span>Real-time live order tracking</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className={styles.orderSummary}>
            <h2 className={styles.summaryTitle}>In Your Bag</h2>
            
            <div className={styles.itemList}>
              {displayItems.map((item) => (
                <div key={item.product?.id || Math.random()} className={styles.summaryItem}>
                  <div className={styles.itemImageWrapper}>
                    <img src={item.product?.image || '/assets/products/bouquets-classic-red-rose.jpg'} alt={item.product?.name || 'Item'} />
                    <span className={styles.itemBadge}>{item.quantity}</span>
                  </div>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.product?.name}</span>
                    <span className={styles.itemPrice}>{formatPrice(item.product?.price || 0)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.totals}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{formatPrice(displaySubtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>GST (18%)</span>
                <span>{formatPrice(displayGst)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery</span>
                <span>{displayDelivery === 0 ? 'Free' : formatPrice(displayDelivery)}</span>
              </div>
              {discountAmount > 0 && (
                <div className={styles.summaryRow} style={{ color: 'var(--color-secondary)' }}>
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              
              <div className={styles.couponSection} style={{ display: 'flex', gap: '8px', marginTop: '16px', marginBottom: '8px' }}>
                <Input placeholder="Coupon Code" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                <Button variant="secondary" type="button" onClick={applyCoupon}>Apply</Button>
              </div>

              <div className={styles.totalRow}>
                <span>Total Due on Delivery</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              size="lg" 
              type="submit" 
              className={styles.submitBtn}
              disabled={isProcessing}
            >
              {isProcessing ? 'Confirming Order...' : `Place Order (Cash on Delivery) • Pay ${formatPrice(finalTotal)}`}
            </Button>

            <div className={styles.securityNote}>
              <CheckCircle2 size={16} color="#2E7D32" />
              <span>Zero advance payment • Pay via Cash or UPI at your doorstep</span>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
