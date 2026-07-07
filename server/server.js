require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes, Model } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// --------------------------
// DATABASE SETUP
// --------------------------
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './openclass.db',
  logging: false
});

// --------------------------
// USER MODEL
// --------------------------
class User extends Model {}
User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'student',
      validate: {
        isIn: [['student', 'teacher']]
      }
    }
  },
  { sequelize, modelName: 'User' }
);

// --------------------------
// CLASS MODEL
// --------------------------
class Class extends Model {}
Class.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  { sequelize, modelName: 'Class' }
);

// --------------------------
// MIDDLEWARES
// --------------------------
app.use(cors({ origin: '*' }));
app.use(express.json());

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey123456');
    req.user = await User.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
    if (!req.user) return res.status(401).json({ error: 'User not found' });
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const isTeacher = (req, res, next) => {
  if (req.user && req.user.role === 'teacher') return next();
  return res.status(403).json({ error: 'Only teachers can do this' });
};

// --------------------------
// ROUTES
// --------------------------
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: role || 'student' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'supersecretkey123456', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'supersecretkey123456', { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/classes', authenticate, isTeacher, async (req, res) => {
  try {
    const { name, description } = req.body;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newClass = await Class.create({ name, code, description, createdBy: req.user.id });
    res.status(201).json(newClass);
  } catch (err) {
    console.error('Create class error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/classes', authenticate, async (req, res) => {
  try {
    const classes = await Class.findAll({ order: [['createdAt', 'DESC']] });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------------
// START SERVER
// --------------------------
const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Database connected & ready');
  } catch (err) {
    console.error('❌ Database error:', err);
  }
};
start();

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));