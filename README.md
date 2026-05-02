# Professional MERN Invoice Generator

A robust, full-stack enterprise invoice generation platform built with the MERN stack (MySQL replacing MongoDB). It features multi-tenant authentication, PDF rendering, automated email delivery, skeleton loaders, and a monthly recurring invoice cron engine.

## Features
- **Multi-Tenant Architecture**: Every user has their own private workspace with secure JWT authentication and route protection.
- **Client & Product Catalogs**: Manage reusable clients and products/services to speed up invoice drafting.
- **PDF & Email Integration**: Renders pixel-perfect PDF invoices via `@react-pdf/renderer` and emails them directly to clients using NodeMailer.
- **Recurring Invoices Engine**: Powered by `node-cron`, the server automatically generates and clones monthly recurring invoices silently in the background.
- **Invoice Audit Trails**: Immutably tracks and displays the entire status lifecycle (Draft -> Finalised -> Paid) with user stamps.
- **Skeleton Loaders**: Features pixel-accurate loading states powered by `boneyard-js`.
- **CSV Data Exports**: Zero-dependency browser-side CSV compilation for exporting your financial data.

---

## 🚀 Quick Setup

### 1. Prerequisites
Ensure you have the following installed on your machine:
- Node.js (v18+)
- MySQL (v8+)

### 2. Database Configuration
Create a local MySQL database. You can name it whatever you want, but for this guide we will use `invoice_generator`.
```sql
CREATE DATABASE invoice_generator;
```

### 3. Environment Variables (.env)
You will need to create two `.env` files.

**Backend (`server/.env`)**
```env
# Database configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=invoice_generator
PORT=5000

# Authentication Secret
JWT_SECRET=supersecretjwtkey_12345

# Email Delivery Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

**Frontend (`client/.env`)**
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Installation
Install dependencies for both the frontend and backend.
```bash
# In the root directory (if using concurrent scripts) or individually:
cd server && npm install
cd ../client && npm install
```

---

## 🗄️ Database Migrations & Seeding

This project uses **Sequelize ORM** which handles automatic migrations using `sequelize.sync()`. You do not need to run manual SQL migration scripts. When the server boots up, it will automatically analyze your models and create/update the tables in your MySQL database.

### Seeding the Database
To avoid manual data entry, you can populate the database with a pre-configured user, clients, products, and templates using the seed script.

Run the following command in the `server` directory:
```bash
npm run seed
```
**Warning**: This script uses `{ force: true }`, which will drop all existing tables and recreate them. Only run this in development!

**Default Seed Credentials:**
- **Email:** `admin@example.com`
- **Password:** `password123`

---

## 🏃 Running the Application

You can start the frontend and backend servers individually:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

The application will be accessible at `http://localhost:5173`. 
The API runs on `http://localhost:5000`.

---

## 💡 Extra Commands

### Generate Skeletons (Boneyard-JS)
If you modify the UI layouts and need to regenerate the loading skeleton bones:
```bash
cd client
npx boneyard-js build http://localhost:5173
```
*(Ensure your React development server is running and the `ProtectedRoute` is temporarily disabled so the crawler can access the dashboard).*
