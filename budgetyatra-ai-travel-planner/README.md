# BudgetYatra — AI Budget Travel Planner

BudgetYatra is a full-stack MERN application styled like a practical travel notebook and expense ledger for budget-conscious Indian travellers.

## Features
- **Intelligent Groq AI Itineraries**: Generates realistic day-by-day plans tailored to duration, travellers, budget, and interests.
- **Server-Side Expense Ledger**: Independent calculation of totals and budget status (`within_budget`, `near_budget`, `over_budget`).
- **Saved Trip Ledgers**: View previously generated trips saved in MongoDB Atlas.
- **Responsive Notebook Design**: Custom terracotta & earthy palette built mobile-first with Tailwind CSS.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Axios, React Router DOM
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose), Groq SDK (`openai/gpt-oss-20b`)

## Setup Instructions

### 1. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Fill in MONGODB_URI and GROQ_API_KEY in .env
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
