import db from '../database/setup_db.mjs';

class DeviceModel {
  static async getAllDevices() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM devices', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static async addDevice(device) {
    const { name, consumption, location, energySource, usageTime } = device;
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO devices (name, consumption, location, energy_source, usage_time) VALUES (?, ?, ?, ?, ?)',
        [name, consumption, location, energySource, usageTime],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  static async removeDevice(deviceId) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM devices WHERE id = ?', [deviceId], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  static async getDeviceById(deviceId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM devices WHERE id = ?', [deviceId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  static async updateDevice(deviceId, updates) {
    const updateFields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const updateValues = Object.values(updates);

    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE devices SET ${updateFields} WHERE id = ?`,
        [...updateValues, deviceId],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });
  }
}

export default DeviceModel;
