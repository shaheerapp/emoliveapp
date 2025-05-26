export const formatNumber = input => {
  const number = Number(input);
  if (isNaN(number)) { return '0'; }

  const absNumber = Math.abs(number);

  if (absNumber >= 1000000) {
    return `${(absNumber / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  } else if (absNumber >= 1000) {
    return `${(absNumber / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  } else {
    return absNumber.toString();
  }
};
