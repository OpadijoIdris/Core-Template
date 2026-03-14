# Coree-Template - Backend Engine

The robust backend engine powering **Coree-Template**, a professional e-commerce platform. Built with **Express.js v5**, it features a sophisticated order management system, real-time chat, and high-performance analytics.

## 🚀 Key Features

- **Advanced Order Lifecycle**: Support for **Paystack** and **Pay on Delivery (POD)** with automated stock management and order auditing.
- **Enterprise-grade Refund System**: Automatic refund initiation for Paystack transactions upon order cancellation by an admin.
- **Real-time Live Chat**: Integrated customer support system with conversation threading and order-linked tickets.
- **Enhanced Security**: Multi-layered protection with JWT (via httpOnly cookies), rate limiting, Helmet, and HPP.
- **Inventory Intelligence**: Automated stock tracking, low-stock notifications, and category/subcategory hierarchies.
- **Admin Dashboard API**: Deep insights into revenue trends, order status distribution, and user engagement metrics.

---

## 🏗️ System Architecture & Logic

### Database Schema (ERD)

The system utilizes PostgreSQL for its core relational data:
- **User**: Core identity management (Roles: USER, ADMIN, SUPER_ADMIN).
- **Product**: Fully managed via categories and subcategories; Cloudinary for media assets.
- **Cart**: Persistent user-specific shopping sessions.
- **Order**: Complex state machine (PENDING, PAID, CANCELLED, FULFILLED).
- **OrderAudit**: Immutable logs tracking all status changes for transparency and debugging.
- **Conversation & Message**: Threaded support system with real-time status updates.

### Core Business Logic

1.  **Order Processing**:
    - Orders are created with an **idempotency key** to prevent duplicate payments.
    - **POD (Pay on Delivery)**: Orders are fulfilled by administrators upon successful delivery.
    - **Paystack Integration**: Handled via secure API and webhooks for real-time status updates.
2.  **Advanced Refund Logic**:
    - **Automated Trigger**: Refunds are automatically processed when an admin cancels a paid order.
    - **API Integration**: Direct communication with the **Paystack Refund API**.
    - **Verification**: 
        - Ensures only paid orders can be refunded.
        - Prevents multiple refund requests for the same transaction.
        - Detailed error reporting and tracking of refund status (`REQUESTED`, `SUCCESS`, `FAILED`).
3.  **Authentication**: Secure JWT-based auth with email verification and password reset flows.

---

## 📡 API Documentation Overview

### Base URL: `/api`

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/auth/login` | POST | User/Admin login |
| **Products** | `/product` | GET | List all active products |
| **Orders** | `/order/me` | GET | Get current user's order history |
| **Chat** | `/chat/me` | GET | Get user support thread |
| **Analytics**| `/analytics/admin/overview`| GET | (Admin) Get revenue & system health stats |

---

## 🛠️ Setup & Installation

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Configure Environment**:
    Create a `.env` file from `.env.example` with your Database URL, JWT secret, and Cloudinary keys.
3.  **Database Setup**:
    ```bash
    npx prisma migrate dev
    npx prisma generate
    npx prisma db seed
    ```
4.  **Start Server**:
    ```bash
    npm run dev
    ```

---

## 🛡️ License

Exclusively available via **CodeCanyon**.
