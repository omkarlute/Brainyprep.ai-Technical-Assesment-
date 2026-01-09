
---

# 🧠 Blockchain Transactions Dashboard

A compact blockchain-style transaction explorer and transaction creation dashboard.
Designed to demonstrate clean architecture, predictable state management, and a Web3-inspired user experience.

🌐 **Live Demo:** [https://YOUR-VERCEL-LINK.vercel.app  ](https://blockchain-web3-explorer.vercel.app/dashboard)
📦 **Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, MongoDB

---

## 🚀 1. Project Overview

This application delivers two core features:

1. **Transaction List / Explorer**
2. **Transaction Details + Transaction Creation Workflow**

Key goals:

* Clean, modular architecture
* Predictable state management
* Strong form validation
* Responsive Web3 UI with smooth UX
* Fully functional end-to-end flow

### **Tech Stack**

* **Next.js (App Router)**
* **TypeScript**
* **Tailwind + custom neon Web3 theme**
* **shadcn/ui**
* **React Hook Form + Zod**
* **LocalStorage for persistence**
* **Optimistic UI updates**

---

## ✅ 2. Task Completion Details

### **Task 1 — Transaction List**

Implemented with:

* Complete transaction table (hash, from, to, amount, status, timestamp)
* Search with 300ms debounce
* Status + date-range filtering
* Sorting by date, amount, and status
* Pagination
* Relative + absolute timestamps
* Status color badges
* Copy-to-clipboard buttons
* Loading skeletons
* Error + retry state
* Fully responsive layout
* CSV export
* 15-second real-time polling
* Dark/light mode switch

---

### **Task 2 — Transaction Details & Create Transaction**

#### **Transaction Details Drawer**

* Full breakdown view
* Gas limit, gas price, and fee calculation
* Copy buttons
* “View on Explorer” external link
* Smooth animated drawer

#### **Create Transaction Form**

* Strong Zod validation
* Ethereum address pattern enforcement
* Positive number validation
* Optional gas fields with defaults
* Live fee preview
* LocalStorage draft auto-restore
* Optimistic create flow (with rollback on failure)
* Toast success/error notifications
* Auto-refresh after creating a transaction

---

## 🛠 3. Project Setup

### **Backend Setup**

#### 1. Navigate to backend directory

```sh
cd backend
```

#### 2. Install dependencies

```sh
npm install
```

#### 3. Create `.env` file

**Windows:**

```powershell
Copy-Item .env.example .env
```

**Mac/Linux:**

```bash
cp .env.example .env
```

#### 4. Add your MongoDB connection string

**Local MongoDB:**

```env
MONGODB_URI=mongodb://localhost:27017/brainyprep-assessment
```

**MongoDB Atlas:**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/brainyprep-assessment
```

#### 5. Ensure MongoDB is running

Make sure you have a running MongoDB instance (local or Atlas).

#### 6. Start the backend server

```sh
npm run start:dev
```

Backend runs at:

**[http://localhost:3000](http://localhost:3000)**

---




### **Frontend Setup**

1. Navigate to the frontend directory:

```sh
cd frontend
```

2. Install dependencies:

```sh
npm install
```

3. (Optional) Create `.env.local`:

**Windows:**

```powershell
Copy-Item .env.local.example .env.local
```

**Mac/Linux:**

```bash
cp .env.local.example .env.local
```

4. Start dev server:

```sh
npm run dev
```

Frontend runs at:
**[http://localhost:3001](http://localhost:3001)**

---

## 4. 📁 Architecture

```
/app/transactions/page.tsx            — main dashboard
/components/transactions/
   ├── TransactionDetails.tsx         — animated drawer
   └── CreateTransactionForm.tsx      — validated creation form
/lib/api/                             — API wrapper
/lib/utils/                           — shared helpers
/styles/neon-theme.css                — neon Web3 theme
```

---

## 5. 🧠 Key Design Choices

* **Normalization layer (normalizeTx)** → handles backend field differences
* **Optimistic UI updates**
* **Memoized filtering & sorting**
* **Silent background polling**
* **LocalStorage persistence**

---

## 6. 📡 API Contract

### `GET /api/transactions`

Returns list of transactions.

### `GET /api/transactions/:id`

Returns full transaction details.

### `POST /api/transactions`

Example body:

```json
{
  "toAddress": "0xabc...",
  "amount": "1.0",
  "gasLimit": "21000",
  "gasPrice": "0.00000002"
}
```

---

## 7. ▶ Running the Entire Project

**Root install:**

```sh
npm install
```

**Run frontend:**

```sh
cd frontend
npm run dev
```

**Run backend:**

```sh
cd backend
npm run start:dev
```

---

## 8. 🧪 Testing

### Unit tests cover:

* Address validation
* Amount validation
* Timestamp formatting
* Fee calculation
* Transaction normalization

### Manually tested UI flows:

* Search
* Filters
* Sorting
* Drawer
* Form validation
* Draft restore
* Optimistic creation
* Polling refresh

---

## 9. 📌 Assumptions

* Backend may return varying field names → normalization handles it
* Gas fields returned as strings
* Status: `pending | confirmed | failed`
* Timestamp assumed ISO

---

## 10. 🎯 Closing Notes

This codebase mirrors how I would design a small-scale internal blockchain dashboard:

* Maintainable file layout
* Strong typing
* Predictable data flow
* Consistent UI patterns
* Web3-inspired visual theme
* Fully tested core flows

Everything required by the assessment is fully implemented.

```
```
