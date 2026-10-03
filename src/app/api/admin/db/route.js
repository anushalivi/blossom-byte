import { NextResponse } from 'next/server';
import { getConfig, saveConfig } from '@/lib/config';
import { Pool } from 'pg';
import { seedDatabase } from '@/lib/seed';

export async function GET() {
  const config = getConfig();
  const rawUri = config?.dbUri || process.env.DATABASE_URL || '';
  // Never expose full password in URI to frontend for security
  const maskedUri = rawUri ? rawUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : '';
  
  return NextResponse.json({ 
    success: true, 
    uri: maskedUri, 
    dbName: config?.dbName || 'neondb (Neon PostgreSQL)',
    dbType: 'PostgreSQL' 
  });
}

export async function POST(req) {
  try {
    const { action, dbConfig, adminUser } = await req.json();

    if (action === 'test') {
      const uri = dbConfig.uri;
      if (uri.startsWith('postgres')) {
        const pool = new Pool({ connectionString: uri, connectionTimeoutMillis: 5000, ssl: { rejectUnauthorized: false } });
        const client = await pool.connect();
        await client.query('SELECT 1');
        client.release();
        await pool.end();
        return NextResponse.json({ success: true, message: 'Neon PostgreSQL connected successfully!' });
      } else {
        const mongoose = (await import('mongoose')).default;
        const conn = await mongoose.createConnection(uri, { 
          dbName: dbConfig.dbName, 
          serverSelectionTimeoutMS: 5000 
        }).asPromise();
        await conn.close();
        return NextResponse.json({ success: true, message: 'Connection successful' });
      }
    }

    if (action === 'switch') {
      // Reset Next.js cache
      if (global.pgPool) {
        await global.pgPool.end().catch(() => {});
        global.pgPool = null;
      }
      
      // Save new configuration locally
      saveConfig({ 
        dbUri: dbConfig.uri, 
        dbName: dbConfig.dbName,
        dbType: dbConfig.uri.startsWith('postgres') ? 'postgres' : 'mongodb' 
      });
      
      // If adminUser was provided, auto-initialize
      if (adminUser) {
        await seedDatabase(adminUser);
      }
      
      return NextResponse.json({ success: true, message: 'Database switched successfully' });
    }
    
    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
