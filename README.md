# Blossom Byte

Blossom Byte is a full-stack flower e-commerce and admin platform built with Next.js, React, and MongoDB. The project includes a storefront, cart and checkout flow, user auth, profile management, admin dashboard, and an automated first-time setup wizard that seeds the database and creates the admin account.

## Project overview

This application is structured as a modern Next.js app with:
- Frontend: Next.js 16, React 19, Tailwind-like custom CSS patterns, Framer Motion, GSAP, Three.js and Lucide icons
- Backend/API: Next.js route handlers
- Database: MongoDB with Mongoose
- Authentication: JWT + bcryptjs
- Setup flow: automatic database configuration and seeding

The app includes:
- Landing page and product catalog
- Category pages and product detail pages
- Cart, wishlist, orders, and profile flows
- Admin dashboard for products, customers, orders, categories, database, and settings
- Automatic database seeding with 75+ premium flower products

## Tech stack

- Next.js: 16.2.10
- React: 19.2.4
- MongoDB: Mongoose 9.x
- Authentication: JWT + bcryptjs
- State and UI: React context, Framer Motion, GSAP

## Repository structure

- `src/app` — pages and API routes
- `src/components` — reusable UI components
- `src/context` — auth, cart, product and order contexts
- `src/lib` — config, database connection, models, and seed scripts
- `blossom-config.example.json` — config template
- `blossom-config.json` — generated runtime config after setup

## Prerequisites

Before running the project, make sure you have:
- Node.js 20+ recommended
- npm installed
- A MongoDB Atlas cluster or a local MongoDB instance

## Installation and run instructions

### 1) Install dependencies

```bash
npm install
```

### 2) Configure the app (optional manual step)

The project includes a template config file:

```bash
cp blossom-config.example.json blossom-config.json
```

Then edit `blossom-config.json` and fill in your MongoDB values:

```json
{
  "dbUri": "mongodb+srv://<username>:<password>@cluster0.mongodb.net",
  "dbName": "blossom-byte",
  "isSetupComplete": false,
  "setupDate": ""
}
```

Important:
- Replace `<username>` and `<password>` with your real MongoDB database user credentials.
- The app also supports the first-run setup wizard, which automatically writes this config file for you.

### 3) Run the application in development mode

```bash
npm run dev
```

Open the app in your browser:

```text
http://localhost:3000
```

### 4) First-time setup wizard

On the first visit, if the database is not configured, the app redirects to `/setup`.

Complete the wizard with:
- Full name
- Admin email
- Phone number
- Password
- MongoDB connection string
- Database name

After successful initialization, the app seeds the database and creates the admin user automatically.

### 5) Production build

To run the production build locally:

```bash
npm run build
npm run start
```

## Admin credentials

There are two types of admin credentials to be aware of:

### 1) Admin account created during setup wizard

This is the real admin account generated when you complete the Setup Wizard. Use the email and password you entered during setup.

Example:
- Email: `anusha6363@gmail.com`
- Password: `@Anusha2026`

This is the account configured for the master admin dashboard.

### 2) Admin credentials & Fallback

Use the configured master admin credentials:
- Email: `anusha6363@gmail.com`
- Password: `@Anusha2026`

These credentials are also available as fallback offline credentials if ever needed.

## Neon PostgreSQL Setup

The project is configured with Neon PostgreSQL:
- **Connection URI**: `postgresql://neondb_owner:npg_cEqrFLahQ9e0@ep-bitter-boat-b43kti0i-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
- **Database Engine**: Neon PostgreSQL (SQL)
- **Active Admin**: `anusha6363@gmail.com` / `@Anusha2026`

## MongoDB setup guidance

If you do not already have a MongoDB instance:

1. Create a MongoDB Atlas account.
2. Create a free cluster.
3. Add a database user.
4. Allow network access from anywhere (`0.0.0.0/0`) or your machine IP.
5. Copy the connection string.

Example:

```text
mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
```

## App behavior after setup

After initialization, the project automatically does the following:
- Connects to MongoDB
- Creates the required database and collections
- Seeds 75+ premium flower products
- Adds default categories
- Creates the admin user
- Saves default store settings such as currency, GST, delivery fee, and contact info

## Accessing the admin panel

Once you log in as an admin, open the admin dashboard from the user/profile section or directly at:

```text
http://localhost:3000/admin
```

The admin panel includes sections for:
- Dashboard
- Orders
- Products
- Categories
- Customers
- Database
- Settings

## Troubleshooting

### App keeps redirecting to setup

This usually means `blossom-config.json` is missing or `dbUri` is empty. Re-run the Setup Wizard or regenerate the file.

### Database connection fails

Check:
- MongoDB URI correctness
- Network access settings in MongoDB Atlas
- Correct user credentials
- Database name is valid

### Login fails after setup

Use the master admin credentials: `anusha6363@gmail.com` / `@Anusha2026`.

## Notes

- The app is designed to automatically seed demo data for you.
- The `blossom-config.json` file is generated at the project root and is required for persistent database configuration.
- The admin password and seeded user data are created during first-run setup; keep your admin credentials secure.

## License

This project is provided as a local development and demo project for Blossom Byte.
# blossom-byte
