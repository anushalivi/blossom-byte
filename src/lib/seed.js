import { seedPostgres } from './seedPostgres';

export async function seedDatabase(adminData) {
  console.log('Seeding Neon PostgreSQL database with admin:', adminData?.email || 'anusha6363@gmail.com');
  return seedPostgres(adminData);
}
