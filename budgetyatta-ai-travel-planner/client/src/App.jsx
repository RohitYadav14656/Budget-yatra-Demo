import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import PlannerPage from './pages/PlannerPage';
import TripDetailPage from './pages/TripDetailPage';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#20302D] font-sans antialiased selection:bg-[#E86B4A]/20">
      {/* Notebook Header */}
      <header className="bg-[#FFFCF7] border-b border-[#DED8CE] sticky top-0 z-10 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group min-w-0">
            <div className="w-8 h-8 bg-[#E86B4A] text-white font-serif font-bold text-lg rounded flex items-center justify-center shrink-0">
              BY
            </div>
            <div className="min-w-0 truncate">
              <span className="text-xl font-serif font-bold tracking-tight text-[#20302D] group-hover:text-[#E86B4A] transition-colors block truncate">
                BudgetYatta
              </span>
              <span className="block text-[10px] tracking-wider uppercase text-[#66706C] truncate">
                AI Travel Ledger
              </span>
            </div>
          </Link>

          <Link 
            to="/" 
            className="px-3 py-1.5 text-xs font-bold bg-[#F7F3EC] border border-[#DED8CE] hover:border-[#20302D] rounded text-[#20302D] transition-colors shrink-0"
          >
            + New Trip
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Routes>
          <Route path="/" element={<PlannerPage />} />
          <Route path="/trips/:tripId" element={<TripDetailPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-[#FFFCF7] border-t border-[#DED8CE] mt-12 py-6 text-center text-xs text-[#66706C]">
        <div className="max-w-6xl mx-auto px-4">
          <p>BudgetYatta — AI Budget Travel Planner for Indian Travellers</p>
        </div>
      </footer>
    </div>
  );
}
