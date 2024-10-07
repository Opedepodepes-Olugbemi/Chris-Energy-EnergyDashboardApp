console.log('searchDevices.mjs loaded');

// Function to get devices from local storage
function getDevices() {
  const devices = localStorage.getItem('devices');
  return devices ? JSON.parse(devices) : [];
}

// Function to save devices to local storage
function saveDevices(devices) {
  localStorage.setItem('devices', JSON.stringify(devices));
}

// Function to search devices by location
function searchDevicesByLocation(location) {
  const devices = getDevices();
  return devices.filter(device => 
    device.location.toLowerCase().includes(location.toLowerCase())
  );
}

// Function to update the table with search results
function updateTable(devices) {
  const tableBody = document.querySelector('#device-table tbody');
  tableBody.innerHTML = '';
  
  devices.forEach(device => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${device.name}</td>
      <td>${device.type}</td>
      <td>${device.location}</td>
      <td>${device.status}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Event listener for the search button
document.getElementById('search-devices').addEventListener('click', () => {
  const locationInput = document.getElementById('location-input');
  const location = locationInput.value.trim();
  const matchingDevices = searchDevicesByLocation(location);
  updateTable(matchingDevices);
});

// Initialize some sample data if local storage is empty
if (getDevices().length === 0) {
  const sampleDevices = [
    { id: '1', name: 'Device 1', type: 'Type A', location: 'Room 101', status: 'Active' },
    { id: '2', name: 'Device 2', type: 'Type B', location: 'Room 102', status: 'Inactive' },
    { id: '3', name: 'Device 3', type: 'Type A', location: 'Room 103', status: 'Active' },
  ];
  saveDevices(sampleDevices);
}

// Initial table population
updateTable(getDevices());
