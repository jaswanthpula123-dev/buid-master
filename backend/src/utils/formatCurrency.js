const formatINR = (amount, useShortWords = true) => {
  if (amount === undefined || amount === null || amount === '') return '₹0';
  if (typeof amount === 'string' && amount.includes('₹')) return amount;

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

module.exports = { formatINR };
