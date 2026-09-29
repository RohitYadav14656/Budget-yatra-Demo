import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';

export default function ExpenseBreakdown({ expenseBreakdown, totalBudget, estimatedTotalCost }) {
  if (!expenseBreakdown) return null;

  const { stay, food, transport, activities, miscellaneous } = expenseBreakdown;

  const categories = [
    { label: 'Accommodation / Stay', amount: stay },
    { label: 'Food & Meals', amount: food },
    { label: 'Local Transport', amount: transport },
    { label: 'Activities & Sightseeing', amount: activities },
    { label: 'Miscellaneous & Buffer', amount: miscellaneous },
  ];

  const difference = totalBudget - estimatedTotalCost;

  return (
    <div className="bg-[#FFFCF7] border border-[#DED8CE] rounded-lg p-5 sm:p-6 shadow-sm">
      <h3 className="text-xl font-serif font-bold text-[#20302D] border-b border-[#DED8CE] pb-3 mb-4">
        Expense Ledger Breakdown
      </h3>

      <div className="divide-y divide-[#DED8CE] text-xs sm:text-sm">
        {categories.map((cat, idx) => {
          const percentage = estimatedTotalCost > 0 ? Math.round((cat.amount / estimatedTotalCost) * 100) : 0;
          return (
            <div key={idx} className="py-2.5 flex items-center justify-between">
              <span className="text-[#20302D] font-medium">{cat.label}</span>
              <div className="text-right">
                <span className="font-bold text-[#20302D] block">{formatCurrency(cat.amount)}</span>
                <span className="text-[10px] text-[#66706C]">{percentage}% of total</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t-2 border-[#20302D] space-y-2 text-xs sm:text-sm">
        <div className="flex justify-between font-bold text-[#20302D]">
          <span>Estimated Total Cost</span>
          <span>{formatCurrency(estimatedTotalCost)}</span>
        </div>

        <div className="flex justify-between font-bold text-[#66706C]">
          <span>Your Planned Budget</span>
          <span>{formatCurrency(totalBudget)}</span>
        </div>

        <div className={`flex justify-between font-bold pt-2 border-t border-[#DED8CE] ${
          difference >= 0 ? 'text-[#2F7D5A]' : 'text-[#B5463D]'
        }`}>
          <span>{difference >= 0 ? 'Remaining Surplus' : 'Budget Deficit'}</span>
          <span>{difference >= 0 ? `+${formatCurrency(difference)}` : `-${formatCurrency(Math.abs(difference))}`}</span>
        </div>
      </div>
    </div>
  );
}
