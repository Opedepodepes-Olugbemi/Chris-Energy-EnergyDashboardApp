// Helper function to get data from localStorage
const getLocalStorageData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Helper function to set data in localStorage
const setLocalStorageData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getAllDevices = (req, res) => {
  const devices = getLocalStorageData('devices');
  res.json(devices);
};

export const addDevice = (req, res) => {
  const { name, consumption, location, energySource, usageTime } = req.body;
  const devices = getLocalStorageData('devices');
  const newDevice = { id: Date.now(), name, consumption, location, energySource, usageTime };
  devices.push(newDevice);
  setLocalStorageData('devices', devices);
  res.status(201).json({ message: 'Device added successfully', device: newDevice });
};

export const removeDevice = (req, res) => {
  const { id } = req.params;
  let devices = getLocalStorageData('devices');
  devices = devices.filter(device => device.id !== parseInt(id));
  setLocalStorageData('devices', devices);
  res.json({ message: 'Device removed successfully' });
};

// Add more controller methods as needed
