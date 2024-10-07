import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/device-leaderboard', (req, res) => {
    res.render('deviceLeaderboard');
});

app.get('/usage-statistics', (req, res) => {
    res.render('usageStatistics');
});

app.get('/manage-devices', (req, res, next) => {
    try {
        res.render('manageDevices');
    } catch (error) {
        console.error('Error rendering manageDevices:', error);
        next(error);
    }
});

app.get('/search-location', (req, res) => {
    res.render('locationSelection');
});

app.post('/api/devices', (req, res) => {
    const devices = JSON.parse(localStorage.getItem('devices')) || [];
    const newDevice = req.body;
    devices.push(newDevice);
    localStorage.setItem('devices', JSON.stringify(devices));
    res.status(201).json(newDevice);
});

app.delete('/api/devices/:id', (req, res) => {
    const devices = JSON.parse(localStorage.getItem('devices')) || [];
    const updatedDevices = devices.filter(device => device.id !== req.params.id);
    localStorage.setItem('devices', JSON.stringify(updatedDevices));
    res.status(204).send();
});

app.get('/api/conversions', (req, res) => {
    const conversions = JSON.parse(localStorage.getItem('conversions')) || [];
    res.json(conversions);
});

app.post('/api/conversions', (req, res) => {
    const conversions = JSON.parse(localStorage.getItem('conversions')) || [];
    const newConversion = req.body;
    conversions.push(newConversion);
    localStorage.setItem('conversions', JSON.stringify(conversions));
    res.status(201).json(newConversion);
});


// Update the existing API routes or add new ones if needed
app.put('/api/devices/:id', (req, res) => {
    const deviceId = req.params.id;
    const updatedDevice = req.body;
    
    // Get current devices from local storage
    let devices = JSON.parse(localStorage.getItem('devices') || '[]');
    
    // Find and update the device
    const index = devices.findIndex(device => device.id === deviceId);
    if (index !== -1) {
        devices[index] = { ...devices[index], ...updatedDevice };
        localStorage.setItem('devices', JSON.stringify(devices));
        res.json(devices[index]);
    } else {
        res.status(404).json({ message: 'Device not found' });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { error: err });
});

app.use((req, res, next) => {
    res.status(404).render('error', { error: { status: 404, message: 'Page not found' } });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
