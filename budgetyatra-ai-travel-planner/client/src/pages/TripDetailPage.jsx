import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TripSummary from '../components/TripSummary';
import ItineraryTimeline from '../components/ItineraryTimeline';
import ExpenseBreakdown from '../components/ExpenseBreakdown';
import PreviousTrips from '../components/PreviousTrips';
import { fetchTripByIdApi, fetchAllTripsApi } from '../api/tripApi';

export default function TripDetailPage() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [previousTrips, setPreviousTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTripData = async () => {
      try {
        setIsLoading(true);
        setError('');
        const [tripRes, listRes] = await Promise.all([
          fetchTripByIdApi(tripId),
          fetchAllTripsApi()
        ]);

        if (tripRes.success) setTrip(tripRes.data);
        if (listRes.success) setPreviousTrips(listRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load saved trip detail.');
      } finally {
        setIsLoading(false);
      }
    };

    if (tripId) {
      loadTripData();
    }
  }, [tripId]);

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#E86B4A] border-t-transparent mb-3"></div>
        <p className="text-xs sm:text-sm text-[#66706C]">Loading trip details...</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="bg-[#FFFCF7] border border-[#DED8CE] rounded-lg p-6 sm:p-8 text-center space-y-4">
        <h2 className="text-xl font-serif font-bold text-[#B5463D]">Trip Not Found</h2>
        <p className="text-xs text-[#66706C]">{error || 'The requested trip itinerary does not exist.'}</p>
        <Link 
          to="/" 
          className="inline-block px-4 py-2 bg-[#20302D] text-white text-xs font-bold rounded"
        >
          ← Back to Planner
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xs font-bold text-[#E86B4A] hover:underline flex items-center gap-1"
        >
          ← Plan a New Trip
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <TripSummary trip={trip} />
          <ExpenseBreakdown 
            expenseBreakdown={trip.expenseBreakdown} 
            totalBudget={trip.totalBudget} 
            estimatedTotalCost={trip.estimatedTotalCost} 
          />
          <ItineraryTimeline itinerary={trip.itinerary} />
        </div>

        <div className="lg:col-span-1 min-w-0">
          <PreviousTrips 
            trips={previousTrips} 
            isLoading={false} 
            activeTripId={tripId} 
          />
        </div>
      </div>
    </div>
  );
}
