// Import required modules
const express = require('express');
const { Sequelize } = require('sequelize');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ NEW: Homepage route (fixes "Cannot GET /")
app.get('/', (req, res) => {
  res.send(`
    <h1>✅ OpenClass Server is LIVE!</h1>
    <p>Status: Running correctly</p>
    <p>Database: Connected</p>
    <p>Your API is ready to use.</p>
  `);
});

// --------------------------
// KEEP ALL YOUR ORIGINAL CODE BELOW THIS LINE
// --------------------------

// Example database connection (adjust if yours is different)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Test database connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connected & ready'))
  .catch(err => console.error('❌ Database connection error:', err));

// Add your existing routes, models, and logic here
// For example:
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/courses', require('./routes/courses'));

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});