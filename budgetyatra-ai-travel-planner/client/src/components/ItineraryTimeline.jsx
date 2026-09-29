import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';

export default function ItineraryTimeline({ itinerary }) {
  if (!itinerary || itinerary.length === 0) return null;

  return (
    <div className="bg-[#FFFCF7] border border-[#DED8CE] rounded-lg p-4 sm:p-6 shadow-xs min-w-0">
      <h3 className="text-lg sm:text-xl font-serif font-bold text-[#20302D] border-b border-[#DED8CE] pb-3 mb-4 sm:mb-5">
        Day-by-Day Itinerary
      </h3>

      <div className="space-y-4 sm:space-y-6">
        {itinerary.map((item) => (
          <div 
            key={item.day}
            className="border border-[#DED8CE] rounded-lg p-3.5 sm:p-5 bg-[#F7F3EC]/50 hover:bg-[#F7F3EC] transition-colors min-w-0"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#DED8CE] pb-2 mb-3 gap-1.5 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2 py-0.5 bg-[#20302D] text-[#FFFCF7] text-[11px] font-bold rounded shrink-0">
                  Day {item.day}
                </span>
                <h4 className="text-sm sm:text-base font-serif font-bold text-[#20302D] truncate">
                  {item.title}
                </h4>
              </div>
              <span className="text-xs font-bold text-[#E86B4A] shrink-0">
                Est. Day Cost: {formatCurrency(item.estimatedCost)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 text-xs text-[#20302D] mb-3">
              <div className="p-2.5 bg-[#FFFCF7] border border-[#DED8CE] rounded">
                <span className="font-bold text-[#E86B4A] block mb-0.5">🌅 Morning</span>
                <p className="text-[#66706C] leading-relaxed break-words">{item.morning}</p>
              </div>

              <div className="p-2.5 bg-[#FFFCF7] border border-[#DED8CE] rounded">
                <span className="font-bold text-[#E86B4A] block mb-0.5">☀️ Afternoon</span>
                <p className="text-[#66706C] leading-relaxed break-words">{item.afternoon}</p>
              </div>

              <div className="p-2.5 bg-[#FFFCF7] border border-[#DED8CE] rounded">
                <span className="font-bold text-[#E86B4A] block mb-0.5">🌙 Evening</span>
                <p className="text-[#66706C] leading-relaxed break-words">{item.evening}</p>
              </div>
            </div>

            {item.foodSuggestion && (
              <div className="p-2.5 bg-[#E4B55A]/15 border border-[#E4B55A]/30 rounded text-xs text-[#20302D] break-words">
                <span className="font-bold text-[#20302D]">🍱 Food Suggestion: </span>
                <span className="text-[#66706C]">{item.foodSuggestion}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
