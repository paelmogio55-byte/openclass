const express = require('express');
const cors = require('cors');
const app = express();

// Allow requests from your Netlify site
app.use(cors({
  origin: "https://openclass-site.netlify.app",
  credentials: true
}));

app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('✅ OpenClass Backend is running!');
});

// API Routes
app.post('/api/register', (req, res) => {
  console.log('Register data:', req.body);
  res.json({ success: true, message: "Registration successful!" });
});

app.post('/api/login', (req, res) => {
  console.log('Login data:', req.body);
  res.json({ success: true, message: "Login successful!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));