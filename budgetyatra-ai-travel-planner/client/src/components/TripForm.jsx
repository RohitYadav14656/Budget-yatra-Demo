import React, { useState } from 'react';

const INTEREST_OPTIONS = [
  'Food', 'Culture', 'Shopping', 'Nature', 
  'Adventure', 'Nightlife', 'Relaxation', 'Photography'
];

const ACCOMMODATION_OPTIONS = ['Budget', 'Mid-range', 'Premium'];

export default function TripForm({ onSubmit, isLoading, errors }) {
  const [formData, setFormData] = useState({
    destination: '',
    days: 3,
    travellers: 2,
    totalBudget: 15000,
    accommodation: 'Budget',
    interests: ['Food', 'Culture']
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'days' || name === 'travellers' || name === 'totalBudget' 
        ? Number(value) 
        : value
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => {
      const exists = prev.interests.includes(interest);
      const updated = exists 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: updated };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-[#FFFCF7] border border-[#DED8CE] rounded-lg p-4 sm:p-6 shadow-xs">
      <div className="border-b border-[#DED8CE] pb-3 mb-4 sm:mb-5">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#20302D]">
          Plan Your Journey
        </h2>
        <p className="text-xs text-[#66706C] mt-1">
          Fill out your travel details to calculate a custom budget travel ledger.
        </p>
      </div>

      {errors && errors.length > 0 && (
        <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-[#FDF2F0] border border-[#B5463D]/30 rounded text-[#B5463D] text-xs sm:text-sm">
          <p className="font-semibold mb-1">Please fix the following validation errors:</p>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <label className="block text-xs font-bold text-[#20302D] uppercase tracking-wider mb-1">
            Destination City or Region
          </label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="e.g. Jaipur, Goa, Manali, Munnar"
            required
            className="w-full px-3 py-2 bg-[#F7F3EC] border border-[#DED8CE] rounded text-[#20302D] focus:outline-none focus:border-[#E86B4A] text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#20302D] uppercase tracking-wider mb-1">
              Duration (Days)
            </label>
            <input
              type="number"
              name="days"
              min="1"
              max="30"
              value={formData.days}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-[#F7F3EC] border border-[#DED8CE] rounded text-[#20302D] focus:outline-none focus:border-[#E86B4A] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#20302D] uppercase tracking-wider mb-1">
              Travellers
            </label>
            <input
              type="number"
              name="travellers"
              min="1"
              max="50"
              value={formData.travellers}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-[#F7F3EC] border border-[#DED8CE] rounded text-[#20302D] focus:outline-none focus:border-[#E86B4A] text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#20302D] uppercase tracking-wider mb-1">
            Total Budget (₹ INR)
          </label>
          <input
            type="number"
            name="totalBudget"
            min="500"
            step="500"
            value={formData.totalBudget}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-[#F7F3EC] border border-[#DED8CE] rounded text-[#20302D] focus:outline-none focus:border-[#E86B4A] text-sm font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#20302D] uppercase tracking-wider mb-1">
            Accommodation Preference
          </label>
          <div className="grid grid-cols-3 gap-2">
            {ACCOMMODATION_OPTIONS.map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, accommodation: option }))}
                className={`py-2 px-1 text-xs font-medium rounded border text-center transition-colors cursor-pointer ${
                  formData.accommodation === option
                    ? 'bg-[#E86B4A] text-white border-[#E86B4A]'
                    : 'bg-[#F7F3EC] text-[#20302D] border-[#DED8CE] hover:border-[#E86B4A]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#20302D] uppercase tracking-wider mb-2">
            Interests (Select at least one)
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map(interest => {
              const isSelected = formData.interests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`py-1.5 px-3 text-xs font-medium rounded border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#20302D] text-[#FFFCF7] border-[#20302D]'
                      : 'bg-[#F7F3EC] text-[#66706C] border-[#DED8CE] hover:border-[#20302D]'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-[#E86B4A] hover:bg-[#d65a39] disabled:bg-[#d65a39]/50 text-white font-bold text-sm rounded border border-[#E86B4A] transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? 'Crafting Your Ledger...' : 'Generate My Trip'}
        </button>
      </form>
    </div>
  );
}
