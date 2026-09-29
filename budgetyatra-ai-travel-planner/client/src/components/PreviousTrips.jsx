import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

export default function PreviousTrips({ trips, isLoading, activeTripId }) {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'within_budget':
        return <span className="text-[10px] font-bold text-[#2F7D5A] bg-[#2F7D5A]/10 px-1.5 py-0.5 rounded shrink-0">Within</span>;
      case 'near_budget':
        return <span className="text-[10px] font-bold text-[#C97719] bg-[#C97719]/10 px-1.5 py-0.5 rounded shrink-0">Near</span>;
      case 'over_budget':
        return <span className="text-[10px] font-bold text-[#B5463D] bg-[#B5463D]/10 px-1.5 py-0.5 rounded shrink-0">Over</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#FFFCF7] border border-[#DED8CE] rounded-lg p-4 sm:p-5 shadow-xs min-w-0">
      <h3 className="text-base sm:text-lg font-serif font-bold text-[#20302D] border-b border-[#DED8CE] pb-2 mb-3">
        Saved Trip Ledgers
      </h3>

      {isLoading ? (
        <div className="py-6 text-center text-xs text-[#66706C]">
          Loading saved trips...
        </div>
      ) : !trips || trips.length === 0 ? (
        <div className="py-6 text-center text-xs text-[#66706C] bg-[#F7F3EC] rounded border border-[#DED8CE] p-3">
          No previous trips saved yet. Generate your first itinerary!
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {trips.map((trip) => {
            const isActive = activeTripId === trip._id;
            return (
              <div
                key={trip._id}
                onClick={() => navigate(`/trips/${trip._id}`)}
                className={`p-3 rounded border text-xs cursor-pointer transition-all min-w-0 ${
                  isActive
                    ? 'bg-[#F7F3EC] border-[#E86B4A] shadow-xs'
                    : 'bg-[#FFFCF7] border-[#DED8CE] hover:border-[#20302D]'
                }`}
              >
                <div className="flex justify-between items-start mb-1 gap-2 min-w-0">
                  <span className="font-bold text-[#20302D] text-xs sm:text-sm truncate min-w-0">
                    {trip.destination}
                  </span>
                  {getStatusBadge(trip.budgetStatus)}
                </div>

                <div className="text-[#66706C] text-[11px] mb-2 truncate">
                  {trip.days} Days • {formatCurrency(trip.totalBudget)}
                </div>

                <div className="flex justify-between items-center text-[10px] text-[#66706C] pt-1.5 border-t border-[#DED8CE]/60">
                  <span>{formatDate(trip.createdAt)}</span>
                  <span className="font-semibold text-[#E86B4A]">View Details →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
