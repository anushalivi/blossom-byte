'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Database, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import styles from '../page.module.css';
import { useAuth } from '@/context/AuthContext';

export default function DatabaseManagementPage() {
  const { user } = useAuth();
  const [currentConfig, setCurrentConfig] = useState({ uri: '', dbName: '' });
  const [newConfig, setNewConfig] = useState({ uri: '', dbName: '' });
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [dbTested, setDbTested] = useState(false);
  const [shouldInitialize, setShouldInitialize] = useState(false);

  useEffect(() => {
    fetch('/api/admin/db')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCurrentConfig({ uri: data.uri, dbName: data.dbName });
        }
        setLoading(false);
      });
  }, []);

  const handleTestConnection = async () => {
    setMessage({ type: '', text: '' });
    setTesting(true);
    try {
      const res = await fetch('/api/admin/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test', dbConfig: newConfig })
      });
      const data = await res.json();
      if (data.success) {
        setDbTested(true);
        setMessage({ type: 'success', text: 'Connection successful!' });
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network error.' });
    }
    setTesting(false);
  };

  const handleSwitch = async () => {
    if (!dbTested) return setMessage({ type: 'error', text: 'Test connection first' });
    setMessage({ type: '', text: '' });
    setSwitching(true);
    
    try {
      const adminUser = shouldInitialize ? { email: user.email, name: user.name, password: 'password123', phone: user.phone } : null;
      
      const res = await fetch('/api/admin/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'switch', dbConfig: newConfig, adminUser })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Database switched successfully! App is running on new database.' });
        setCurrentConfig({ uri: '*** URI UPDATED ***', dbName: newConfig.dbName });
        setNewConfig({ uri: '', dbName: '' });
        setDbTested(false);
      } else {
        setMessage({ type: 'error', text: data.error });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to switch database.' });
    }
    setSwitching(false);
  };

  if (loading) return <div style={{ padding: '40px' }}>Loading...</div>;

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Database Management</h1>
          <p className={styles.pageSubtitle}>Hot-swap or manage your Neon PostgreSQL / SQL cluster securely.</p>
        </div>
      </header>

      <GlassCard animate={false} style={{ maxWidth: '800px', padding: '32px', marginBottom: '24px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Database size={18} /> Current Connection
        </h3>
        <div style={{ background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 8px' }}><strong>URI:</strong> <span style={{ fontFamily: 'monospace', opacity: 0.8 }}>{currentConfig.uri}</span></p>
          <p style={{ margin: 0 }}><strong>Database:</strong> {currentConfig.dbName || 'neondb'}</p>
        </div>
      </GlassCard>

      <GlassCard animate={false} style={{ maxWidth: '800px', padding: '32px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <RefreshCw size={18} /> Switch Database
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
          Switching the database will instantly disconnect the current session and point the Next.js server to the new cluster. No server restart required.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input 
            label="Database Connection URI (PostgreSQL or MongoDB)" 
            placeholder="postgresql://... or mongodb+srv://..."
            value={newConfig.uri} 
            onChange={(e) => { setNewConfig({...newConfig, uri: e.target.value}); setDbTested(false); }} 
          />
          <Input 
            label="Database Name (Optional)" 
            value={newConfig.dbName} 
            onChange={(e) => { setNewConfig({...newConfig, dbName: e.target.value}); setDbTested(false); }} 
          />

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={shouldInitialize} 
              onChange={(e) => setShouldInitialize(e.target.checked)} 
            />
            Auto-Initialize this database (Create 75 Products, Categories, and Settings)
          </label>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <Button variant="secondary" onClick={handleTestConnection} disabled={testing || !newConfig.uri}>
              {testing ? 'Testing...' : 'Test Connection'}
            </Button>
            <Button variant="primary" onClick={handleSwitch} disabled={switching || !dbTested}>
              {switching ? 'Switching Database...' : 'Switch Database'}
            </Button>
          </div>

          {message.text && (
            <div style={{ padding: '12px', background: message.type === 'error' ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)', color: message.type === 'error' ? 'red' : 'green', borderRadius: '8px', marginTop: '16px' }}>
              {message.type === 'success' ? <ShieldCheck size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }}/> : <AlertCircle size={16} style={{ verticalAlign: 'middle', marginRight: '4px' }}/>}
              {message.text}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
