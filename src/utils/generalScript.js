export const formatNumber = number => {
  if (typeof number !== 'number' || isNaN(number)) {
    return '0'; // Fallback for invalid input
  }

  const absNumber = Math.abs(number); // Handle negative numbers if needed

  if (absNumber >= 1000000) {
    // Millions (M)
    const value = absNumber / 1000000;
    return `${value % 1 === 0 ? value : value.toFixed(1)}M`;
  } else if (absNumber >= 1000) {
    // Thousands (k)
    const value = absNumber / 1000;
    return `${value % 1 === 0 ? value : value.toFixed(1)}k`;
  } else {
    // Less than 1000, return as is
    return absNumber.toString();
  }
};
