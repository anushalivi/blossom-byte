'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Check, 
  Package, 
  ArrowRight, 
  Download, 
  Truck, 
  Banknote, 
  QrCode, 
  Copy, 
  CheckCheck,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useOrders } from '@/context/OrderContext';
import styles from './page.module.css';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const urlId = searchParams.get('id');
  const orderNumber = urlId || `ORD-${Math.floor(Math.random() * 90000) + 10000}`;
  const { getOrder } = useOrders();
  const [copied, setCopied] = useState(false);

  const orderData = getOrder(orderNumber);
  const totalAmount = orderData?.total || 4800;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleCopyId = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadInvoice = () => {
    let doc = `========================================\n`;
    doc += `        BLOSSOM BYTE BOTANICALS\n`;
    doc += `       TAX INVOICE & ORDER RECEIPT\n`;
    doc += `========================================\n\n`;
    doc += `Order Number   : ${orderNumber}\n`;
    doc += `Order Date     : ${new Date(orderData?.date || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}\n`;
    doc += `Payment Mode   : Cash on Delivery (Cash / UPI at Doorstep)\n`;
    doc += `Payment Status : Pending (To be paid to delivery executive)\n\n`;
    
    if (orderData?.userDetails) {
      doc += `DELIVERY TO:\n`;
      doc += `Name    : ${orderData.userDetails.firstName} ${orderData.userDetails.lastName}\n`;
      doc += `Phone   : ${orderData.userDetails.phone || 'N/A'}\n`;
      doc += `Address : ${orderData.userDetails.address}, ${orderData.userDetails.city}, ${orderData.userDetails.state} - ${orderData.userDetails.pin}\n\n`;
    }
    
    doc += `----------------------------------------\n`;
    doc += `ITEMS PURCHASED:\n`;
    doc += `----------------------------------------\n`;
    if (orderData?.cartDetails && orderData.cartDetails.length > 0) {
      orderData.cartDetails.forEach((item, idx) => {
        doc += `${idx + 1}. ${item.product.name} (x${item.quantity}) - ₹${item.product.price}\n`;
      });
    } else {
      doc += `1. Handcrafted Luxury Floral Arrangement - ${formatPrice(totalAmount)}\n`;
    }
    
    doc += `----------------------------------------\n`;
    doc += `TOTAL DUE ON DELIVERY: ${formatPrice(totalAmount)}\n`;
    doc += `========================================\n`;
    doc += `Note: UPI accepted once order received on your doorstep. Pay to delivery person via Cash or any UPI QR app.\n`;
    doc += `Thank you for choosing Blossom Byte!\n`;

    const blob = new Blob([doc], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BlossomByte-Order-${orderNumber}.txt`;
    a.click();
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={styles.card}
        >
          {/* Animated Celebration Icon */}
          <div className={styles.iconWrapper}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 220 }}
            >
              <Check size={42} className={styles.icon} />
            </motion.div>
          </div>
          
          <span className={styles.placedBadge}>Order Placed Successfully</span>
          <h1 className={styles.title}>Thank You for Your Order!</h1>
          <p className={styles.subtitle}>
            Your fresh floral arrangement is being prepared by our master florists and will be delivered straight to your door.
          </p>
          
          {/* Cash on Delivery & UPI Doorstep Banner */}
          <div className={styles.doorstepCard}>
            <div className={styles.doorstepHeader}>
              <div className={styles.doorstepBadgeWrap}>
                <Banknote size={20} color="#2E7D32" />
                <span className={styles.doorstepBadgeText}>Payment: Cash on Delivery</span>
              </div>
              <span className={styles.upiTag}>UPI Accepted at Doorstep</span>
            </div>
            
            <div className={styles.doorstepNotice}>
              <QrCode size={20} className={styles.doorstepNoticeIcon} />
              <div className={styles.doorstepNoticeText}>
                <strong>UPI accepted once order received on your doorstep — Pay to delivery person</strong>
                <p>
                  Keep <strong>{formatPrice(totalAmount)}</strong> ready. When our delivery executive arrives, you can pay with physical Cash or scan their official UPI QR code (Google Pay, PhonePe, Paytm, BHIM) on the spot.
                </p>
              </div>
            </div>
          </div>

          {/* Order Details Grid */}
          <div className={styles.orderDetails}>
            <div className={styles.detailRow}>
              <span>Order Number</span>
              <div className={styles.orderIdGroup}>
                <strong>{orderNumber}</strong>
                <button 
                  type="button" 
                  onClick={handleCopyId} 
                  className={styles.copyBtn}
                  title="Copy Order ID"
                >
                  {copied ? <CheckCheck size={14} color="#2E7D32" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <div className={styles.detailRow}>
              <span>Order Date</span>
              <strong>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
            </div>
            <div className={styles.detailRow}>
              <span>Estimated Delivery</span>
              <strong style={{ color: '#2E7D32' }}>Today / Same-Day Express</strong>
            </div>
            <div className={styles.detailRow}>
              <span>Total Due on Delivery</span>
              <strong style={{ fontSize: '16px', color: '#1A1A1A' }}>{formatPrice(totalAmount)}</strong>
            </div>

            {orderData?.userDetails?.address && (
              <div className={styles.detailRow} style={{ borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '10px' }}>
                <span>Delivery Address</span>
                <strong style={{ textAlign: 'right', maxWidth: '60%' }}>
                  {orderData.userDetails.address}, {orderData.userDetails.city} - {orderData.userDetails.pin}
                </strong>
              </div>
            )}
          </div>

          {/* Real-time Order Progress Mini-Tracker */}
          <div className={styles.miniTracker}>
            <div className={styles.trackerHeader}>
              <span className={styles.trackerTitle}>Order Progress</span>
              <span className={styles.liveIndicator}>
                <span className={styles.pulseDot}></span>
                Live Updates Active
              </span>
            </div>
            <div className={styles.trackerSteps}>
              <div className={`${styles.trackStep} ${styles.completed}`}>
                <div className={styles.stepBubble}>✓</div>
                <span>Order Placed</span>
              </div>
              <div className={styles.trackConnectorActive}></div>
              <div className={`${styles.trackStep} ${styles.inProgress}`}>
                <div className={styles.stepBubble}>🌸</div>
                <span>Florist Crafting</span>
              </div>
              <div className={styles.trackConnector}></div>
              <div className={styles.trackStep}>
                <div className={styles.stepBubble}>🚚</div>
                <span>Out for Delivery</span>
              </div>
              <div className={styles.trackConnector}></div>
              <div className={styles.trackStep}>
                <div className={styles.stepBubble}>🏡</div>
                <span>Doorstep Pay</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className={styles.primaryActionWrap}>
            <Link href={`/track-order?id=${orderNumber}`} className={styles.trackBtnMain}>
              <Truck size={20} />
              <span>Track Your Order Now</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Secondary Action Links */}
          <div className={styles.actions}>
            <Button 
              variant="secondary" 
              className={styles.fullWidth} 
              onClick={handleDownloadInvoice}
            >
              <Download size={16} /> Download Invoice
            </Button>
            <Link href="/orders" style={{ flex: 1 }}>
              <Button variant="secondary" className={styles.fullWidth}>My Orders</Button>
            </Link>
            <Link href="/products" style={{ flex: 1 }}>
              <Button variant="secondary" className={styles.fullWidth}>
                Shop More
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: '160px 20px', textAlign: 'center' }}>Loading your order confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
