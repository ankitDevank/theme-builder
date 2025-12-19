# Page Builder

A modern, powerful web application for building and managing Page with a dynamic, logic-driven interface. Built with Next.js 16, Prisma, and Tailwind CSS 4.

## 🚀 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM 7](https://www.prisma.io/)
- **Authentication**: [Next-Auth](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) database

## 📦 Installation & Setup

Follow these steps to get the project running locally:

### 1. Clone the Repository
```bash
git clone <repository-url>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the `page-builder` directory and add the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/theme_builder_db?schema=public"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
SHOULD_SEED="true"
```
> [!TIP]
> You can generate a secret key using `openssl rand -base64 32`.

### 4. Database Initialization
Run the following commands to set up your database schema and seed initial data:

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database
npm run db:seed
```

## 🏃 Running the Project

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

### Production Build
```bash
npm run build
npm run start
```

## 🧪 Testing

Run the test suite using Jest:
```bash
npm run test
```

## 📂 Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components.
- `lib/`: Utility functions and shared logic (Prisma client, Auth).
- `prisma/`: Database schema and seed scripts.
- `types/`: TypeScript type definitions.
- `public/`: Static assets.

## 👥 Seed Accounts

After seeding, you can log in with the following default accounts (all passwords are `password@123`):

- **Admin**: `admin@test.com`
- **Editor**: `editor1@test.com`, `editor2@test.com`
- **User**: `user1@test.com`, `user2@test.com`
