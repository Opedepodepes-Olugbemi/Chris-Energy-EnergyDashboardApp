document.addEventListener('DOMContentLoaded', function() {
  // Initialize devices from local storage or use default if empty
  let devices = JSON.parse(localStorage.getItem('devices')) || {};

  // Function to save devices to local storage
  function saveDevicesToLocalStorage() {
    localStorage.setItem('devices', JSON.stringify(devices));
  }

  // Function to update the device table with optional location filter
  function updateDeviceTable(filterLocation = '') {
    console.log("Updating device table with filter:", filterLocation);
    const tableBody = document.querySelector('#device-table tbody');
    tableBody.innerHTML = '';
    Object.entries(devices)
      .filter(([_, data]) => filterLocation === '' || data.location.toLowerCase().includes(filterLocation.toLowerCase()))
      .forEach(([device, data]) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
          <td>${device}</td>
          <td>${data.consumption.toFixed(2)}</td>
          <td>${data.location}</td>
          <td>${data.energySource}</td>
          <td>${data.usageTime}</td>
          <td>
            <button class="remove-device" data-device="${device}">Remove</button>
          </td>
        `;
      });

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-device').forEach(button => {
      button.addEventListener('click', function() {
        const deviceToRemove = this.getAttribute('data-device');
        removeDevice(deviceToRemove);
      });
    });
    console.log("Device table updated");
  }

  // Function to remove a device
  function removeDevice(deviceName) {
    if (confirm(`Are you sure you want to remove ${deviceName}?`)) {
      delete devices[deviceName];
      saveDevicesToLocalStorage();
      updateDeviceTable();
      updateDeviceLeaderboard();
      updateUsageStatistics();
      alert(`${deviceName} has been removed.`);
    }
  }

  // Function to show all devices in the table when the window loads
  function showAllDevices() {
    console.log("Showing all devices");
    updateDeviceTable();
  }

  // Add event listener to load all devices when the window starts
  window.addEventListener('load', showAllDevices);

  // New function to update devices
  function updateDevices(updatedDevices) {
    devices = updatedDevices;
    saveDevicesToLocalStorage();
    updateDeviceTable();
    updateDeviceLeaderboard();
    updateUsageStatistics();
    console.log("Devices updated successfully");
  }

  // Example usage of updateDevices (you can remove this in production)
  window.updateDevicesExample = function() {
    const updatedDevices = {
      "Smart TV": {
        location: "Living Room",
        consumption: 120,
        energySource: "electric",
        usageTime: 5
      },
      "Refrigerator": {
        location: "Kitchen",
        consumption: 150,
        energySource: "electric",
        usageTime: 24
      },
      "Solar Panel": {
        location: "Roof",
        consumption: -500,
        energySource: "solar",
        usageTime: 8
      },
      "Electric Car Charger": {
        location: "Garage",
        consumption: 750,
        energySource: "electric",
        usageTime: 3
      }
    };
    updateDevices(updatedDevices);
    alert('Devices have been updated!');
  };

  // Initial updates
  updateDeviceTable();
  updateDeviceLeaderboard();
  updateUsageStatistics();

  // Expose the updateDevices function globally
  window.updateDevices = updateDevices;
});
