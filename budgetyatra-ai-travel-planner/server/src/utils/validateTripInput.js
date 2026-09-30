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

  const destinationRegex = /^[a-zA-Z\s,.'-]{2,50}$/;
  const hasVowel = /[aeiouyAEIOUY]/.test(destination);
  const isKeyboardMash = /(.)\1{3,}|^(dfgh|asdf|qwert|zxcv|fghj|ghjk|hjkl|yuiop|xcvb|cvbn|vbnm)/i.test(destination);

  if (!destination || destination.length < 2 || destination.length > 50 || !destinationRegex.test(destination) || !hasVowel || isKeyboardMash) {
    errors.push('Please enter a valid travel destination (e.g. Jaipur, Goa, Manali, Paris).');
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
