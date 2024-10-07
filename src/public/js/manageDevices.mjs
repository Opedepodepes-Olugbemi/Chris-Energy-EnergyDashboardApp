document.addEventListener('DOMContentLoaded', function() {
    let devices = JSON.parse(localStorage.getItem('devices')) || {};

    function saveDevicesToLocalStorage() {
        localStorage.setItem('devices', JSON.stringify(devices));
    }

    function updateDeviceTable() {
        const tableBody = document.querySelector('#device-table tbody');
        tableBody.innerHTML = '';
        Object.entries(devices).forEach(([device, data]) => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td><input type="text" class="edit-input" data-field="name" value="${device}" readonly></td>
                <td><input type="text" class="edit-input" data-field="location" value="${data.location}" readonly></td>
                <td>
                    <button class="edit-device" data-device="${device}">Edit</button>
                    <button class="save-device" data-device="${device}" style="display:none;">Save</button>
                    <button class="remove-device" data-device="${device}">Remove</button>
                </td>
            `;
        });

        addEventListeners();
    }

    function addEventListeners() {
        document.querySelectorAll('.edit-device').forEach(button => {
            button.addEventListener('click', function() {
                const deviceToEdit = this.getAttribute('data-device');
                enableEditing(deviceToEdit);
            });
        });

        document.querySelectorAll('.save-device').forEach(button => {
            button.addEventListener('click', function() {
                const deviceToSave = this.getAttribute('data-device');
                saveDeviceChanges(deviceToSave);
            });
        });

        document.querySelectorAll('.remove-device').forEach(button => {
            button.addEventListener('click', function() {
                const deviceToRemove = this.getAttribute('data-device');
                removeDevice(deviceToRemove);
            });
        });
    }

    function enableEditing(deviceName) {
        const row = document.querySelector(`button[data-device="${deviceName}"]`).closest('tr');
        row.querySelectorAll('.edit-input').forEach(input => {
            input.removeAttribute('readonly');
        });
        row.querySelector('.edit-device').style.display = 'none';
        row.querySelector('.save-device').style.display = 'inline-block';
    }

    function saveDeviceChanges(oldDeviceName) {
        const row = document.querySelector(`button[data-device="${oldDeviceName}"]`).closest('tr');
        const inputs = row.querySelectorAll('.edit-input');
        const newDeviceName = inputs[0].value;
        const newLocation = inputs[1].value;

        if (oldDeviceName !== newDeviceName) {
            devices[newDeviceName] = { ...devices[oldDeviceName] };
            delete devices[oldDeviceName];
        }
        devices[newDeviceName].location = newLocation;

        saveDevicesToLocalStorage();
        updateDeviceTable();
    }

    function removeDevice(deviceName) {
        if (confirm(`Are you sure you want to remove ${deviceName}?`)) {
            delete devices[deviceName];
            saveDevicesToLocalStorage();
            updateDeviceTable();
        }
    }

    function updateDevices(updatedDevices) {
        devices = updatedDevices;
        saveDevicesToLocalStorage();
        updateDeviceTable();
    }

    // Initial table population
    updateDeviceTable();

    // Expose the updateDevices function globally
    window.updateDevices = updateDevices;
});