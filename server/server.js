const express = require('express');
const cors = require('cors');
const app = express();

// --------------------------
// ✅ CORS CONFIGURATION
// --------------------------
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://regal-clafoutis-1dc712.netlify.app",
    "https://openclass-site.netlify.app"
  ],
  credentials: true
}));

// --------------------------
// ✅ MIDDLEWARE
// --------------------------
app.use(express.json()); // Parse JSON request bodies

// --------------------------
// ✅ YOUR DATABASE / ROUTES GO HERE
// --------------------------
// Keep all your existing code below this line — example structure:
// const db = require('./your-db-file');
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/courses', require('./routes/courses'));

// Example root route
app.get('/', (req, res) => {
  res.send('OpenClass Server is LIVE! 🚀');
});

// --------------------------
// ✅ START SERVER
// --------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});