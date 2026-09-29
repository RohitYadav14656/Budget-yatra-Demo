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
          <span className="inline-block px-2.5 py-1 text-xs font-bold bg-[#2F7D5A]/15 text-[#2F7D5A] border border-[#2F7D5A]/30 rounded shrink-0">
            Within Budget
          </span>
        );
      case 'near_budget':
        return (
          <span className="inline-block px-2.5 py-1 text-xs font-bold bg-[#C97719]/15 text-[#C97719] border border-[#C97719]/30 rounded shrink-0">
            Near Budget Limit
          </span>
        );
      case 'over_budget':
        return (
          <span className="inline-block px-2.5 py-1 text-xs font-bold bg-[#B5463D]/15 text-[#B5463D] border border-[#B5463D]/30 rounded shrink-0">
            Over Budget
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#FFFCF7] border border-[#DED8CE] rounded-lg p-4 sm:p-6 shadow-xs space-y-5 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#DED8CE] pb-4 min-w-0">
        <div className="min-w-0">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#E86B4A] block truncate">
            {destination} • {days} Days • {travellers} {travellers === 1 ? 'Traveller' : 'Travellers'}
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#20302D] mt-1 break-words">
            {tripTitle}
          </h1>
        </div>
        <div className="self-start">
          {getStatusBadge(budgetStatus)}
        </div>
      </div>

      <p className="text-xs sm:text-sm text-[#66706C] leading-relaxed break-words">
        {summary}
      </p>

      {/* Key Numbers Ledger Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
        <div className="p-3 bg-[#F7F3EC] border border-[#DED8CE] rounded min-w-0">
          <span className="block text-[10px] font-bold text-[#66706C] uppercase truncate">Total Budget</span>
          <span className="text-sm sm:text-base md:text-lg font-bold text-[#20302D] block truncate">{formatCurrency(totalBudget)}</span>
        </div>

        <div className="p-3 bg-[#F7F3EC] border border-[#DED8CE] rounded min-w-0">
          <span className="block text-[10px] font-bold text-[#66706C] uppercase truncate">Est. Total Cost</span>
          <span className="text-sm sm:text-base md:text-lg font-bold text-[#20302D] block truncate">{formatCurrency(estimatedTotalCost)}</span>
        </div>

        <div className="p-3 bg-[#F7F3EC] border border-[#DED8CE] rounded min-w-0">
          <span className="block text-[10px] font-bold text-[#66706C] uppercase truncate">Daily / Person</span>
          <span className="text-sm sm:text-base md:text-lg font-bold text-[#E86B4A] block truncate">{formatCurrency(budgetPerTravellerPerDay)}</span>
        </div>

        <div className="p-3 bg-[#F7F3EC] border border-[#DED8CE] rounded min-w-0">
          <span className="block text-[10px] font-bold text-[#66706C] uppercase truncate">
            {estimatedTotalCost <= totalBudget ? 'Remaining' : 'Deficit'}
          </span>
          <span className={`text-sm sm:text-base md:text-lg font-bold block truncate ${
            estimatedTotalCost <= totalBudget ? 'text-[#2F7D5A]' : 'text-[#B5463D]'
          }`}>
            {formatCurrency(Math.abs(totalBudget - estimatedTotalCost))}
          </span>
        </div>
      </div>

      {travelTips && travelTips.length > 0 && (
        <div className="bg-[#E4B55A]/10 border border-[#E4B55A]/40 rounded p-3.5 sm:p-4 text-xs text-[#20302D]">
          <h4 className="font-bold text-xs sm:text-sm mb-1.5 text-[#20302D] flex items-center gap-1.5">
            💡 Local Budget Tips
          </h4>
          <ul className="list-disc list-inside space-y-1 text-[#66706C]">
            {travelTips.map((tip, idx) => (
              <li key={idx} className="break-words">{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
