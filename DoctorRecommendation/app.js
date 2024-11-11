const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.json());  // For parsing JSON bodies

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/patient-consultation', (req, res) => {
  res.sendFile(path.join(__dirname, 'patient-consultation.html'));
});

app.get('/doctor-registration', (req, res) => {
  res.sendFile(path.join(__dirname, 'doctor-registration.html'));
});

// API to get doctor data
app.get('/api/doctors', (req, res) => {
  fs.readFile(path.join(__dirname, 'doctors.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading doctor data.');
    }
    res.json(JSON.parse(data));
  });
});

// API to register a new doctor
app.post('/api/register-doctor', (req, res) => {
  const newDoctor = req.body;

  // Read current doctors data
  fs.readFile(path.join(__dirname, 'doctors.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error reading doctor data.' });
    }

    const doctors = JSON.parse(data);
    doctors.push(newDoctor);

    // Save updated doctors data
    fs.writeFile(path.join(__dirname, 'doctors.json'), JSON.stringify(doctors, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error saving doctor data.' });
      }
      res.json({ success: true });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
