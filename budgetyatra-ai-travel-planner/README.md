# BudgetYatra — Travel Planner & Expense Ledger

BudgetYatra is a full-stack MERN travel planning application styled like a practical travel notebook and expense ledger for travellers in India.

## Key Features

- **Custom Travel Itineraries**: Generates realistic day-by-day plans tailored to trip duration, travellers, budget, and interests.
- **Server-Side Expense Ledger**: Automatic calculation of cost breakdowns and budget status (`within_budget`, `near_budget`, `over_budget`).
- **Saved Trip History**: View, load, and inspect previously generated trips saved in MongoDB Atlas.
- **Responsive Earthy Design**: Custom terracotta palette built mobile-first using Tailwind CSS.
- **Strict Input & Destination Validation**: Ensures travel inputs and destination entries are verified before generating itineraries.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Axios, React Router DOM, Vite
- **Backend**: Node.js, Express.js, MongoDB Atlas (Mongoose), Groq SDK

## Project Structure

```
budgetyatra-ai-travel-planner/
├── client/          # React frontend (Vite + Tailwind CSS)
└── server/          # Node.js Express backend API
```

## Environment Setup

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
CLIENT_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend server:
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.
