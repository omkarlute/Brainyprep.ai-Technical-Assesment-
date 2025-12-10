````md
# brainyprep.ai — Transactions Dashboard  
A compact blockchain-style transaction explorer and creation interface built for the assessment.  
The goal was to deliver a clean, reliable, and production-ready implementation of both required tasks.

---

## 1. 🚀 Project Overview  
This application provides two core features:

1. A complete **transaction list interface**  
2. A **transaction details view + transaction creation workflow**

The focus was on:

- Clean architecture  
- Predictable state management  
- Accurate validation  
- A responsive Web3-oriented UI  

### **Built with**
- Next.js (App Router)  
- TypeScript  
- Tailwind + custom neon Web3 theme  
- shadcn/ui  
- React Hook Form + Zod  
- LocalStorage persistence  
- Optimistic UI updates  

---

## 2. ✅ Task Completion Details

### **Task 1 — Transaction List**
Fully implemented with:

- Full transaction table: hash, from, to, amount, status, timestamp  
- Search with 300ms debounce  
- Filtering by status + date range  
- Sorting by date, amount, and status  
- Pagination  
- Relative & absolute timestamps  
- Status color indicators  
- Copy buttons  
- Loading skeletons  
- Error state with retry  
- Responsive layout  
- CSV export  
- Real-time polling (15s)  
- Smooth dark/light mode switching  

---

### **Task 2 — Transaction Details + Create Form**

#### **Transaction Details Drawer**
- Full transaction breakdown  
- Gas price, gas limit, and calculated fee  
- Copy buttons  
- “View on Explorer” link  
- Smooth animated overlay  
- Consistent theme  

#### **Transaction Creation Form**
- Zod validation  
- Ethereum address pattern check  
- Positive amount validation  
- Optional gas fields with defaults  
- Live transaction fee preview  
- LocalStorage draft restore  
- Optimistic updates with rollback  
- Toast notifications  
- Auto-refresh after success  

---

## 3. 🛠 Project Setup

### **Backend Setup**

1. Navigate to the backend directory:

```sh
cd backend
````

2. Install dependencies:

```sh
npm install
```

3. Create `.env` from the example:

**Windows:**

```powershell
Copy-Item .env.example .env
```

**Mac/Linux:**

```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string:

**Local MongoDB:**

```env
MONGODB_URI=mongodb://localhost:27017/brainyprep-assessment
```

**MongoDB Atlas:**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/brainyprep-assessment
```

5. Ensure MongoDB is running.

6. Start backend server:

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
