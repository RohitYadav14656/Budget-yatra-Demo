import React, { useState, useEffect } from 'react';
import TripForm from '../components/TripForm';
import TripSummary from '../components/TripSummary';
import ItineraryTimeline from '../components/ItineraryTimeline';
import ExpenseBreakdown from '../components/ExpenseBreakdown';
import PreviousTrips from '../components/PreviousTrips';
import { generateTripApi, fetchAllTripsApi } from '../api/tripApi';

export default function PlannerPage() {
  const [currentTrip, setCurrentTrip] = useState(null);
  const [previousTrips, setPreviousTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [apiError, setApiError] = useState('');

  const loadSavedTrips = async () => {
    try {
      setIsListLoading(true);
      const res = await fetchAllTripsApi();
      if (res.success) {
        setPreviousTrips(res.data);
      }
    } catch (err) {
      console.error('Failed to load saved trips:', err);
    } finally {
      setIsListLoading(false);
    }
  };

  useEffect(() => {
    loadSavedTrips();
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setFormErrors([]);
      setApiError('');
      
      const response = await generateTripApi(formData);
      if (response.success && response.data) {
        setCurrentTrip(response.data);
        await loadSavedTrips();
      }
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData?.errors) {
        setFormErrors(responseData.errors);
      } else {
        setApiError(responseData?.message || 'Failed to generate itinerary. Check backend connectivity.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {apiError && (
        <div className="p-4 bg-[#FDF2F0] border border-[#B5463D]/30 rounded-lg text-[#B5463D] text-xs sm:text-sm font-medium">
          <strong>Error: </strong>{apiError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <TripForm 
            onSubmit={handleFormSubmit} 
            isLoading={isLoading} 
            errors={formErrors} 
          />

          {isLoading && (
            <div className="bg-[#FFFCF7] border border-[#DED8CE] rounded-lg p-6 sm:p-10 text-center space-y-3">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#E86B4A] border-t-transparent"></div>
              <h3 className="text-lg font-serif font-bold text-[#20302D]">Calculating Travel Expenses</h3>
              <p className="text-xs text-[#66706C]">
                Building your custom travel itinerary and expense ledger...
              </p>
            </div>
          )}

          {currentTrip && !isLoading && (
            <div className="space-y-6 min-w-0">
              <TripSummary trip={currentTrip} />
              <ExpenseBreakdown 
                expenseBreakdown={currentTrip.expenseBreakdown} 
                totalBudget={currentTrip.totalBudget} 
                estimatedTotalCost={currentTrip.estimatedTotalCost} 
              />
              <ItineraryTimeline itinerary={currentTrip.itinerary} />
            </div>
          )}
        </div>

        <div className="lg:col-span-1 min-w-0">
          <PreviousTrips 
            trips={previousTrips} 
            isLoading={isListLoading} 
            activeTripId={currentTrip?._id} 
          />
        </div>
      </div>
    </div>
  );
}
