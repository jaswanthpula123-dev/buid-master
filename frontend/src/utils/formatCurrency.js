/**
 * Formats a number or string into Indian Currency (INR / ₹)
 * Examples:
 *   18500000 -> "₹1.85 Cr"
 *   9500000  -> "₹95 Lakhs"
 *   480000   -> "₹4.8 Lakhs"
 *   45000    -> "₹45,000"
 */
export const formatINR = (amount, useShortWords = true) => {
  if (amount === undefined || amount === null || amount === '') return '₹0';
  
  // If already contains ₹ symbol, return as is
  if (typeof amount === 'string' && amount.includes('₹')) {
    return amount;
  }
  
  // Clean numerical value
  const num = typeof amount === 'number' ? amount : Number(String(amount).replace(/[^0-9.-]+/g, ''));
  if (isNaN(num)) return `₹${amount}`;

  if (useShortWords) {
    if (num >= 10000000) {
      const cr = (num / 10000000).toFixed(2).replace(/\.00$/, '');
      return `₹${cr} Cr`;
    }
    if (num >= 100000) {
      const lk = (num / 100000).toFixed(2).replace(/\.00$/, '');
      return `₹${lk} Lakhs`;
    }
  }

  return `₹${num.toLocaleString('en-IN')}`;
};

/**
 * Formats price per square foot in INR
 * Example: 4500 -> "₹4,500/sq.ft"
 */
export const formatPricePerSqFt = (price, areaSqFt) => {
  if (!price || !areaSqFt) return '';
  const priceNum = typeof price === 'number' ? price : Number(String(price).replace(/[^0-9.-]+/g, ''));
  const areaNum = typeof areaSqFt === 'number' ? areaSqFt : Number(String(areaSqFt).replace(/[^0-9.-]+/g, ''));
  if (!priceNum || !areaNum) return '';
  
  const perSqFt = Math.round(priceNum / areaNum);
  return `₹${perSqFt.toLocaleString('en-IN')}/sq.ft`;
};

export default formatINR;
