// Helper function to get data from localStorage
const getLocalStorageData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Helper function to set data in localStorage
const setLocalStorageData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getConversionFactors = (req, res) => {
  const factors = getLocalStorageData('conversion_factors');
  res.json(factors);
};

export const performConversion = (req, res) => {
  const { fromType, toType, value } = req.body;
  
  const conversionFactors = getLocalStorageData('conversion_factors');
  const factor = conversionFactors.find(cf => cf.from_type === fromType && cf.to_type === toType);
  
  if (!factor) {
    return res.status(400).json({ error: 'Conversion factor not found' });
  }
  
  const result = value * factor.factor;
  
  const conversionHistory = getLocalStorageData('conversion_history');
  conversionHistory.push({
    from_type: fromType,
    to_type: toType,
    input_value: value,
    output_value: result,
    timestamp: new Date().toISOString()
  });
  setLocalStorageData('conversion_history', conversionHistory);
  
  res.json({ result });
};

// Add more controller methods as needed
