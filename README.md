# Coree-Template - Professional E-Commerce Ecosystem

Welcome to **Coree-Template**, a high-performance, enterprise-ready e-commerce platform designed for modern retail. This monorepo contains both an advanced **Node.js/PostgreSQL** backend and a cutting-edge **Next.js** frontend.

## 🌟 Project Vision

Coree-Template is built for scalability and reliability. It leverages a modern architecture to provide a robust, feature-rich shopping experience that is easy to deploy and customize.

### Key Capabilities:
- **Advanced Order Lifecycle**: Complete state machine for orders (Pending, Paid, Fulfilled, Cancelled) with automated stock management.
- **Integrated Payments**: Native support for **Paystack** and localized **Pay on Delivery (POD)**.
- **Automated Refund System**: Built-in logic to handle automated refunds via Paystack when orders are cancelled.
- **Live Support Chat**: Real-time communication system connecting customers directly to the admin team.
- **Business Intelligence**: Real-time analytics dashboard for revenue trends and inventory health.
- **Scalable Architecture**: Designed to easily integrate additional providers like Stripe or PayPal.

---

## 📁 Repository Structure

```
Coree-Template/
├── backend/                    # Node.js + Express + Prisma (PostgreSQL)
│   ├── src/                    # API logic, controllers, services, routes
│   └── prisma/                 # Database schema, migrations, and seed script
└── project-core-frontend/      # Next.js 15 (React 19) + Tailwind CSS v4
    └── src/                    # Components, Hooks, App Router, Zustand
```

---

## 🛠️ Full Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **State**: Zustand & TanStack Query v5
- **Styling**: Tailwind CSS v4 & Framer Motion
- **Visuals**: Recharts for Admin Analytics

### Backend
- **Framework**: Express.js v5
- **ORM**: Prisma (PostgreSQL)
- **Security**: JWT, Helmet, Rate-Limit, HPP
- **Services**: Cloudinary (Media), Nodemailer (SMTP), Redis (Caching)

---

## 🚀 Quick Start (Development)

To get the ecosystem running on your local machine:

### 1. Backend Setup
```bash
cd backend
npm install
# Configure .env based on .env.example
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### 2. Frontend Setup
```bash
cd project-core-frontend
npm install
# Configure .env based on .env.example
npm run dev
```

---

## 📖 Documentation Links

- [Backend Deep Dive](./backend/README.md): API Docs, Refund Logic, and Security.
- [Frontend Deep Dive](./project-core-frontend/README.md): UI Architecture and State Management.

---

## 🛡️ License

This product is licensed exclusively through **CodeCanyon**. Unauthorized redistribution or resale is prohibited.
