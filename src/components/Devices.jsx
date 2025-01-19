// src/components/Devices.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Devices = () => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    axios.get('https://your-api-url.com/devices')
      .then(response => setDevices(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Devices</h1>
      <ul>
        {devices.map(device => (
          <li key={device.id}>{device.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Devices;