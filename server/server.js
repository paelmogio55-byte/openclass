// Import required modules
const express = require('express');
const cors = require('cors'); // added for frontend connection
const { Sequelize } = require('sequelize');
const app = express();

// Enable CORS so your frontend can connect
app.use(cors());

// Middleware to read JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Homepage route
app.get('/', (req, res) => {
  res.send(`
    <h1>✅ OpenClass Server is LIVE!</h1>
    <p>Status: Running correctly</p>
    <p>Database: Connected</p>
    <p>API URL: https://openclass-gqzp.onrender.com</p>
  `);
});

// --------------------------
// YOUR ORIGINAL CODE STARTS HERE
// --------------------------

// Database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Test database connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connected & ready'))
  .catch(err => console.error('❌ Database connection error:', err));

// 📌 Add all your original routes, models, and code here
// Example:
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/courses', require('./routes/courses'));

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});