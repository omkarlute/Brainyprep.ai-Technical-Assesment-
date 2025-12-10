brainyprep.ai Transactions Dashboard
A compact blockchain-style transaction explorer and creation interface built for the assessment.
The goal was to deliver a clean, reliable, and production-ready implementation of both required tasks.
________________________________________
1. Project Overview
This application provides two core features:
1.	A complete transaction list interface
2.	A transaction details view + transaction creation workflow
The focus was on clean architecture, predictable state management, accurate validation, and a responsive Web3-oriented UI.
Built with:
•	Next.js (App Router)
•	TypeScript
•	Tailwind + custom neon Web3 theme
•	shadcn/ui
•	React Hook Form + Zod
•	LocalStorage persistence
•	Optimistic UI updates
________________________________________

2. Task Completion Details

✅ Task 1 — Transaction List
Fully implemented with:
•	Transaction table showing
hash, from, to, amount, status, timestamp
•	Search with 300ms debounce
•	Filtering by status + date range
•	Sorting by date, amount, and status
•	Pagination with indicators
•	Relative timestamps + full timestamps
•	Status color indicators
•	Copy buttons (hash, from, to)
•	Loading skeletons
•	Error state with retry
•	Responsive layout
•	CSV export
•	Real-time polling (15s) without UI flicker
•	Smooth dark/light mode switching


✅ Task 2 — Transaction Details + Create Form
Transaction Details Drawer
•	Full transaction breakdown
•	Gas price, gas limit, and calculated fee
•	Copy buttons
•	“View on Explorer” link
•	Smooth overlay UI
•	Consistent theme with the main dashboard
Transaction Creation Form
•	Zod validation for all fields
•	Ethereum address pattern check
•	Positive amount validation
•	Optional gas fields with defaults
•	Live transaction fee preview
•	LocalStorage draft restore
•	Optimistic creation with rollback on error
•	Toast notifications
•	Auto-refresh after successful creation

3)Project Setup:

•	Backend Setup
  1.Navigate to the backend directory:
  cd backend
  
•	2. Install dependencies:
  npm install

•	3. Create a `.env` file:

•	# On Windows (PowerShell):
	Copy-Item .env.example .env

•	# On Mac/Linux:
•	cp .env.example .env

•	4. Update `.env` with your MongoDB connection string:
  env
  MONGODB_URI=mongodb://localhost:27017/brainyprep-assessment
	# Or use MongoDB Atlas:
  # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/brainyprep-assessment


•	5. Ensure MongoDB is running (local or Atlas)

•	6. Start the backend server:
•	npm run start:dev

•	The backend will run on `http://localhost:3000`

•	### Frontend Setup

•	1. Navigate to the frontend directory:
•	cd frontend

•	2. Install dependencies:
•	npm install

•	3. (Optional) Create a `.env.local` file:

	# On Windows (PowerShell):
	Copy-Item .env.local.example .env.local
	# On Mac/Linux:
	cp .env.local.example .env.local


•	4. Start the development server:
•	npm run dev
•	The frontend will run on `http://localhost:3001`


4. Architecture
/app/transactions/page.tsx               — main dashboard
/components/transactions/
  ├── TransactionDetails.tsx             — animated details drawer
  └── CreateTransactionForm.tsx          — validated creation form
/lib/api/                                — optional API wrapper
/lib/utils/                              — shared helpers + test targets
/styles/neon-theme.css                   — Web3 neon theme layer


Key Design Choices
•	Normalization layer (normalizeTx)
Ensures different backend naming conventions map to one consistent Tx type.
•	Optimistic UI updates
The list updates instantly after creating a transaction.
•	Memoized filtering & sorting
Ensures strong performance even with large datasets.
•	Silent background polling
Keeps statuses fresh without resetting scroll or filters.
•	LocalStorage form persistence
Prevents accidental data loss while filling the form.


5. API Contract
GET /api/transactions
Returns a list of transactions.
GET /api/transactions/:id
Returns the full transaction object.
POST /api/transactions
Body format:
{
  "toAddress": "0xabc...",
  "amount": "1.0",
  "gasLimit": "21000",
  "gasPrice": "0.00000002"
}
Backend variations are normalized automatically.

6. Running the Project
Install dependencies:
npm install
Run development server:
npm run dev
Frontend runs on http://localhost:3001
API expected at http://localhost:3000

7. Testing
Functions covered by unit tests:
•	address validation
•	amount validation
•	timestamp formatting
•	fee calculation
•	transaction normalization
UI flows manually tested:
•	Filtering, searching, sorting
•	Drawer open/close
•	Form validation
•	LocalStorage restore
•	Optimistic creation
•	Polling refresh
•	Error handling

8. Assumptions
•	Backend may return varying field names; normalization handles this.
•	Gas fields returned as strings.
•	“Status” field considered either pending | confirmed | failed.
•	Timestamp is assumed to be ISO-compatible.
________________________________________
9. Closing Notes
This codebase is structured the same way I would approach a lightweight internal blockchain dashboard:
•	maintainable file layout
•	reliable UI behavior
•	strong typing
•	predictable data flow
•	resilient against API inconsistencies
•	polished theme and interaction patterns
Everything required by the assessment is fully implemented and tested.




