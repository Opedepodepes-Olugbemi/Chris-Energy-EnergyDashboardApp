import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Helper function to get data from localStorage
const getLocalStorageData = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

// Helper function to set data in localStorage
const setLocalStorageData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

// Energy Types
router.get('/energy-types', (req, res) => {
    const energyTypes = getLocalStorageData('energy_types');
    res.json(energyTypes);
});

// Conversion Factors
router.get('/conversion-factors', (req, res) => {
    const conversionFactors = getLocalStorageData('conversion_factors');
    res.json(conversionFactors);
});

// Conversion History
router.get('/conversion-history', (req, res) => {
    const conversionHistory = getLocalStorageData('conversion_history');
    res.json(conversionHistory);
});


// Perform Conversion
router.post('/convert', (req, res) => {
    const { from_type, to_type, value } = req.body;
    
    const conversionFactors = getLocalStorageData('conversion_factors');
    const factor = conversionFactors.find(cf => cf.from_type === from_type && cf.to_type === to_type);
    
    if (!factor) {
        return res.status(400).json({ error: 'Conversion factor not found' });
    }
    
    const result = value * factor.factor;
    
    const conversionHistory = getLocalStorageData('conversion_history');
    conversionHistory.push({
        from_type,
        to_type,
        input_value: value,
        output_value: result,
        timestamp: new Date().toISOString()
    });
    setLocalStorageData('conversion_history', conversionHistory);
    
    res.json({ result });
});

export default router;
