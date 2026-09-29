const validateTripInput = (data) => {
  const errors = [];
  const validAccommodation = ['Budget', 'Mid-range', 'Premium'];
  const validInterests = [
    'Food', 'Culture', 'Shopping', 'Nature', 
    'Adventure', 'Nightlife', 'Relaxation', 'Photography'
  ];

  const destination = data.destination ? String(data.destination).trim() : '';
  const days = Number(data.days);
  const travellers = Number(data.travellers);
  const totalBudget = Number(data.totalBudget);
  const accommodation = data.accommodation ? String(data.accommodation).trim() : '';
  let interests = Array.isArray(data.interests) ? data.interests : [];

  if (!destination || destination.length < 2) {
    errors.push('Destination is required and must be at least 2 characters long.');
  }

  if (isNaN(days) || days < 1 || days > 30) {
    errors.push('Number of days must be between 1 and 30.');
  }

  if (isNaN(travellers) || travellers < 1 || travellers > 50) {
    errors.push('Number of travellers must be between 1 and 50.');
  }

  if (isNaN(totalBudget) || totalBudget < 500) {
    errors.push('Total budget must be at least ₹500.');
  }

  if (!accommodation || !validAccommodation.includes(accommodation)) {
    errors.push('Accommodation must be Budget, Mid-range, or Premium.');
  }

  interests = interests.filter(item => validInterests.includes(item));
  if (interests.length === 0) {
    errors.push('Select at least one interest.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      destination,
      days,
      travellers,
      totalBudget,
      accommodation,
      interests
    }
  };
};

module.exports = validateTripInput;
