/**
 * Calculate rating class based on score (1-5)
 */
export function getRatingClass(score) {
  if (score >= 4.5) return 'excellent';
  if (score >= 3.5) return 'good';
  if (score >= 2.5) return 'average';
  if (score >= 1.5) return 'notgood';
  return 'damaged';
}

/**
 * Get condition text from score
 */
export function getConditionText(score) {
  if (score >= 4.5) return 'EXCELLENT';
  if (score >= 3.5) return 'GOOD';
  if (score >= 2.5) return 'AVERAGE';
  if (score >= 1.5) return 'NOT GOOD';
  return 'MAJOR DAMAGE';
}

/**
 * Calculate tyre score based on percentages
 */
export function calculateTyreScore(formData) {
  const tyres = [
    formData.front_right_tyre,
    formData.front_left_tyre,
    formData.rear_right_tyre,
    formData.rear_left_tyre,
    formData.stepney_tyre,
  ];
  const avgPercent = tyres.reduce((a, b) => a + b, 0) / tyres.length;
  return (avgPercent / 100) * 5;
}

/**
 * Calculate overall rating from form data
 */
export function calculateOverallRating(formData) {
  const tyres_score = calculateTyreScore(formData);
  const exterior_score = parseFloat(formData.exterior_rating) || 4;
  const interior_score = parseFloat(formData.interior_rating) || 4;
  const engine_score = parseFloat(formData.engine_rating) || 4;
  const suspension_score = parseFloat(formData.suspension_rating) || 4;
  const brakes_score = parseFloat(formData.underchassis_rating) || 4;
  const transmission_score = parseFloat(formData.transmission_rating) || 5;
  const electrical_score = parseFloat(formData.electrical_rating) || 4;
  const ac_score = parseFloat(formData.ac_rating) || 4;
  const misc_score = parseFloat(formData.misc_rating) || 4;
  const accident_score = parseFloat(formData.accident_rating) || 5;

  const overall = (
    tyres_score +
    exterior_score +
    interior_score +
    engine_score +
    suspension_score +
    brakes_score +
    transmission_score +
    electrical_score +
    ac_score +
    misc_score +
    accident_score
  ) / 11;

  return {
    overall,
    sections: [
      { name: 'TYRES', score: tyres_score },
      { name: 'EXTERIOR', score: exterior_score },
      { name: 'INTERIOR', score: interior_score },
      { name: 'ENGINE', score: engine_score },
      { name: 'SUSPENSION', score: suspension_score },
      { name: 'BRAKES', score: brakes_score },
      { name: 'TRANSMISSION', score: transmission_score },
      { name: 'ELECTRICAL', score: electrical_score },
      { name: 'A/C', score: ac_score },
      { name: 'MISC', score: misc_score },
      { name: 'ACCIDENT', score: accident_score },
    ],
  };
}

/**
 * Get bar color class based on status
 */
export function getBarColorClass(status) {
  const goodStatuses = [
    'Working', 'Excellent', 'Good', 'Perfect Condition', 'No Leakage',
    'No Oil Leakage', 'No Noise', 'Available', 'Proper', 'Excellent Working',
    'No Abnormal Engine Noise', 'NO FLOOD SIGNS',
  ];
  const avgStatuses = ['Average', 'Test Drive Not Available'];
  
  if (goodStatuses.includes(status)) return 'green';
  if (avgStatuses.includes(status)) return 'yellow';
  if (status === 'N/A') return 'na';
  return 'red';
}

/**
 * Calculate total refurbishment cost
 */
export function calculateRefurbCost(refurbItems) {
  return refurbItems.reduce((total, item) => total + (parseInt(item.price) || 0), 0);
}

/**
 * Format currency in INR
 */
export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN').format(amount);
}
