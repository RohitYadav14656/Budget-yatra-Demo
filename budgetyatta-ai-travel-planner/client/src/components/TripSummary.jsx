import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';

export default function TripSummary({ trip }) {
  const {
    destination,
    days,
    travellers,
    totalBudget,
    tripTitle,
    summary,
    estimatedTotalCost,
    budgetStatus,
    travelTips
  } = trip;

  const budgetPerTravellerPerDay = Math.round(totalBudget / (days * travellers));

  const getStatusBadge = (status) => {
    switch (status) {
      case 'within_budget':
        return (
          <span className="inline-block px-2.5 py-1 text-xs font-bold bg-[#2F7D5A]/15 text-[#2F7D5A] border border-[#2F7D5A]/30 rounded">
            Within Budget
          </span>
        );
      case 'near_budget':
        return (
          <span className="inline-block px-2.5 py-1 text-xs font-bold bg-[#C97719]/15 text-[#C97719] border border-[#C97719]/30 rounded">
            Near Budget Limit
          </span>
        );
      case 'over_budget':
        return (
          <span className="inline-block px-2.5 py-1 text-xs font-bold bg-[#B5463D]/15 text-[#B5463D] border border-[#B5463D]/30 rounded">
            Over Budget
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#FFFCF7] border border-[#DED8CE] rounded-lg p-5 sm:p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#DED8CE] pb-4">
        <div>
          <span className="text-xs font-bold tracking-wider uppercase text-[#E86B4A]">
            {destination} • {days} Days • {travellers} {travellers === 1 ? 'Traveller' : 'Travellers'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#20302D] mt-1">
            {tripTitle}
          </h1>
        </div>
        <div>
          {getStatusBadge(budgetStatus)}
        </div>
      </div>

      <p className="text-sm text-[#66706C] leading-relaxed">
        {summary}
      </p>

      {/* Key Numbers Ledger Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="p-3 bg-[#F7F3EC] border border-[#DED8CE] rounded">
          <span className="block text-[10px] font-bold text-[#66706C] uppercase">Total Budget</span>
          <span className="text-base sm:text-lg font-bold text-[#20302D]">{formatCurrency(totalBudget)}</span>
        </div>

        <div className="p-3 bg-[#F7F3EC] border border-[#DED8CE] rounded">
          <span className="block text-[10px] font-bold text-[#66706C] uppercase">Est. Total Cost</span>
          <span className="text-base sm:text-lg font-bold text-[#20302D]">{formatCurrency(estimatedTotalCost)}</span>
        </div>

        <div className="p-3 bg-[#F7F3EC] border border-[#DED8CE] rounded">
          <span className="block text-[10px] font-bold text-[#66706C] uppercase">Daily / Traveller</span>
          <span className="text-base sm:text-lg font-bold text-[#E86B4A]">{formatCurrency(budgetPerTravellerPerDay)}</span>
        </div>

        <div className="p-3 bg-[#F7F3EC] border border-[#DED8CE] rounded">
          <span className="block text-[10px] font-bold text-[#66706C] uppercase">
            {estimatedTotalCost <= totalBudget ? 'Remaining' : 'Deficit'}
          </span>
          <span className={`text-base sm:text-lg font-bold ${
            estimatedTotalCost <= totalBudget ? 'text-[#2F7D5A]' : 'text-[#B5463D]'
          }`}>
            {formatCurrency(Math.abs(totalBudget - estimatedTotalCost))}
          </span>
        </div>
      </div>

      {travelTips && travelTips.length > 0 && (
        <div className="bg-[#E4B55A]/10 border border-[#E4B55A]/40 rounded p-4 text-xs text-[#20302D]">
          <h4 className="font-bold text-sm mb-1.5 text-[#20302D] flex items-center gap-1.5">
            💡 Local Budget Tips
          </h4>
          <ul className="list-disc list-inside space-y-1 text-[#66706C]">
            {travelTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
