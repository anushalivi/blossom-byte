import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { CATEGORIES, MOCK_PRODUCTS } from './data.js';

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_cEqrFLahQ9e0@ep-bitter-boat-b43kti0i-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';

export async function seedPostgres(adminCredentials = {
  name: 'Anusha',
  email: 'anusha6363@gmail.com',
  password: '@Anusha2026',
  phone: '+91 98765 43210'
}) {
  const pool = new Pool({ connectionString });

  try {
    console.log('Connecting to Neon PostgreSQL for seeding...');

    // 1. Ensure tables exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        is_admin BOOLEAN DEFAULT FALSE,
        tier VARCHAR(50) DEFAULT 'Silver',
        addresses JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        image TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255),
        description TEXT,
        price NUMERIC(10, 2) NOT NULL,
        discount NUMERIC(5, 2) DEFAULT 0,
        category_id VARCHAR(64) REFERENCES categories(id) ON DELETE SET NULL,
        stock INT DEFAULT 10,
        image TEXT NOT NULL,
        features JSONB DEFAULT '[]'::jsonb,
        is_featured BOOLEAN DEFAULT FALSE,
        sku VARCHAR(100) UNIQUE,
        rating NUMERIC(3, 1) DEFAULT 4.8,
        reviews INT DEFAULT 50,
        delivery_time VARCHAR(100) DEFAULT 'Same Day Delivery',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(64) PRIMARY KEY,
        order_id VARCHAR(64) UNIQUE NOT NULL,
        user_id VARCHAR(64) REFERENCES users(id) ON DELETE SET NULL,
        items JSONB NOT NULL DEFAULT '[]'::jsonb,
        total NUMERIC(10, 2) NOT NULL,
        gst NUMERIC(10, 2) DEFAULT 0,
        delivery_fee NUMERIC(10, 2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Processing',
        shipping_details JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(255) PRIMARY KEY,
        value JSONB NOT NULL
      );
    `);

    // 2. Insert or update Admin User
    const adminEmail = (adminCredentials.email || 'anusha6363@gmail.com').toLowerCase().trim();
    const adminPassword = adminCredentials.password || '@Anusha2026';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminId = 'admin-anusha-01';

    await pool.query(`
      INSERT INTO users (id, name, email, password, phone, is_admin, tier, addresses)
      VALUES ($1, $2, $3, $4, $5, TRUE, 'Platinum', '[]'::jsonb)
      ON CONFLICT (email) 
      DO UPDATE SET 
        password = $4,
        is_admin = TRUE,
        tier = 'Platinum',
        name = $2,
        phone = $5;
    `, [adminId, adminCredentials.name || 'Anusha', adminEmail, hashedPassword, adminCredentials.phone || '+91 98765 43210']);
    console.log(`Admin user seeded: ${adminEmail}`);

    // 3. Seed Categories
    for (const cat of CATEGORIES) {
      await pool.query(`
        INSERT INTO categories (id, name, slug, description, image)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (slug)
        DO UPDATE SET 
          name = EXCLUDED.name,
          image = EXCLUDED.image,
          description = EXCLUDED.description;
      `, [
        cat.id,
        cat.name,
        cat.id,
        `Luxury collection of ${cat.name.toLowerCase()} handcrafted for discerning tastes.`,
        cat.image
      ]);
    }
    console.log(`Categories seeded: ${CATEGORIES.length}`);

    // 4. Seed Products (Clear old products first to ensure exact count)
    await pool.query('DELETE FROM products;');
    let prodCount = 0;
    for (const prod of MOCK_PRODUCTS) {
      await pool.query(`
        INSERT INTO products (
          id, name, slug, description, price, discount, category_id,
          stock, image, features, is_featured, sku, rating, reviews, delivery_time
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (id)
        DO UPDATE SET 
          name = EXCLUDED.name,
          price = EXCLUDED.price,
          discount = EXCLUDED.discount,
          category_id = EXCLUDED.category_id,
          stock = EXCLUDED.stock,
          image = EXCLUDED.image,
          is_featured = EXCLUDED.is_featured,
          sku = EXCLUDED.sku;
      `, [
        prod.id,
        prod.name,
        prod.slug || prod.id,
        prod.longDesc || prod.shortDesc || `Artisanal ${prod.name}`,
        prod.price,
        prod.discount || 0,
        prod.category,
        prod.stock || 20,
        prod.image,
        JSON.stringify(prod.features || ['Artisan Picked', 'Express Delivery', 'Vase Included']),
        Boolean(prod.featured || prod.bestSeller),
        prod.sku || `BLS-${prod.id}`,
        prod.rating || 4.8,
        prod.reviews || 60,
        prod.deliveryTime || 'Same Day Delivery'
      ]);
      prodCount++;
    }
    console.log(`Products seeded: ${prodCount}`);

    // 5. Seed Settings
    const defaultSettings = [
      { key: 'websiteName', value: JSON.stringify('Blossom Byte') },
      { key: 'currency', value: JSON.stringify('INR') },
      { key: 'deliveryFee', value: JSON.stringify(150) },
      { key: 'freeDeliveryThreshold', value: JSON.stringify(1499) },
      { key: 'gstRate', value: JSON.stringify(0.18) },
      { key: 'contactEmail', value: JSON.stringify('anusha6363@gmail.com') },
      { key: 'contactPhone', value: JSON.stringify('+91 98765 43210') },
      { key: 'activeDatabase', value: JSON.stringify('Neon PostgreSQL') }
    ];

    for (const s of defaultSettings) {
      await pool.query(`
        INSERT INTO settings (key, value)
        VALUES ($1, $2)
        ON CONFLICT (key)
        DO UPDATE SET value = EXCLUDED.value;
      `, [s.key, s.value]);
    }
    console.log('Settings seeded successfully.');

    return true;
  } catch (err) {
    console.error('Error during PostgreSQL seeding:', err);
    throw err;
  } finally {
    await pool.end();
  }
}
