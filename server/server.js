const express = require('express');
const cors = require('cors');
const app = express();

// --------------------------
// Basic Setup
// --------------------------
// Allow requests ONLY from your Netlify frontend
app.use(cors({
  origin: "https://openclass-site.netlify.app",
  credentials: true
}));

// Parse JSON data from requests
app.use(express.json());

// --------------------------
// Test Route
// --------------------------
app.get('/', (req, res) => {
  res.send('✅ OpenClass Backend is LIVE and working!');
});

// --------------------------
// API Routes (matches your frontend)
// --------------------------
app.post('/api/register', (req, res) => {
  // You can add your database logic here later
  console.log('📥 Register data received:', req.body);
  res.json({
    success: true,
    message: "✅ Registration successful!"
  });
});

app.post('/api/login', (req, res) => {
  // You can add your database check here later
  console.log('📥 Login data received:', req.body);
  res.json({
    success: true,
    message: "✅ Login successful!"
  });
});

// --------------------------
// Start Server
// --------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});