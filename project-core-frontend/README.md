# Coree-Template - Frontend Application

The elegant and responsive user interface for **Coree-Template**, built with the latest **Next.js** framework and **Tailwind CSS v4**. It provides a seamless shopping experience for users and a powerful dashboard for administrators.

## ✨ Features

- **Dynamic Visuals**: Engaging hero and product sliders using **Swiper.js** and **Framer Motion**.
- **Admin Command Center**: 
  - Real-time revenue analytics (via **Recharts**).
  - Comprehensive order management and fulfillment.
  - Full CRUD operations for Products, Categories, and Subcategories.
  - Integrated support ticket system.
- **Live Support Chat**: Real-time messaging interface for customer inquiries.
- **Optimized Checkout**: Smooth multi-step checkout with support for **Paystack** and **Pay on Delivery**.
- **State Architecture**: High-performance global state handling with **Zustand**.
- **Enterprise-grade Data Sync**: Efficient API synchronization with **TanStack React Query v5**.
- **Responsive Core**: Mobile-first design using **Tailwind CSS v4**.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack React Query v5](https://tanstack.com/query/latest), [Axios](https://axios-http.com/)
- **Visualization**: [Recharts](https://recharts.org/) for business analytics

---

## 📂 Project Structure

- `src/app`: Next.js App Router (Layouts and Pages).
- `src/components`: Modular UI components.
- `src/hooks`: Business logic and API integration hooks.
- `src/services`: API client definitions and endpoints.
- `src/store`: Zustand global state (Auth, Cart).
- `src/types`: TypeScript interfaces for the entire project.

---

## 🚀 Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Setup**:
    Create a `.env.local` file with:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```
3.  **Run Development**:
    ```bash
    npm run dev
    ```
4.  **Production Build**:
    ```bash
    npm run build
    npm start
    ```

---

## 🛡️ License

Exclusively available via **CodeCanyon**.
