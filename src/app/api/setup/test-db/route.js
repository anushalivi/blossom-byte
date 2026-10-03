import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function POST(req) {
  try {
    const { uri, dbName } = await req.json();
    
    if (!uri) {
      return NextResponse.json({ success: false, error: 'Database URI is required' }, { status: 400 });
    }

    if (uri.startsWith('postgres')) {
      const pool = new Pool({ connectionString: uri, connectionTimeoutMillis: 5000, ssl: { rejectUnauthorized: false } });
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      await pool.end();
      return NextResponse.json({ success: true, message: 'Neon PostgreSQL connected successfully' });
    } else {
      const mongoose = (await import('mongoose')).default;
      const conn = await mongoose.createConnection(uri, {
        dbName: dbName || undefined,
        serverSelectionTimeoutMS: 5000
      }).asPromise();
      await conn.close();
      return NextResponse.json({ success: true, message: 'Connected successfully' });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
