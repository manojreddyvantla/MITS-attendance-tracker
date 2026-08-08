/**
 * MITS Attendance AI - Backend Server
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const { initDb } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const aiRoutes = require('./routes/aiRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Middleware Setup
app.use(helmet({
  contentSecurityPolicy: false // Allows inline scripts for local demo
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// General Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests from this IP, please try again later." }
});
app.use('/api', limiter);

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/prediction', predictionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'MITS Attendance AI',
    timestamp: new Date().toISOString(),
    mitsMode: process.env.MITS_INTEGRATION_MODE || 'mock'
  });
});

// Serve compiled frontend assets if present in client/dist or dist
const clientDistPath = fs.existsSync(path.join(__dirname, '..', 'client', 'dist'))
  ? path.join(__dirname, '..', 'client', 'dist')
  : path.join(__dirname, '..', 'dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    const indexFile = path.join(clientDistPath, 'index.html');
    if (fs.existsSync(indexFile)) {
      res.sendFile(indexFile);
    } else {
      next();
    }
  });
}

// Centralized Error Handler
app.use(errorHandler);

// Initialize DB
initDb().catch((err) => console.error('Database initialization error:', err));

// Start standalone Server if executed directly (e.g. node server/server.js)
if (require.main === module) {
  app.listen(PORT, async () => {
    console.log(`🚀 MITS Attendance Tracker Server running on http://localhost:${PORT}`);
    console.log(`🔒 MITS Integration Mode: [${process.env.MITS_INTEGRATION_MODE || 'mock'}]`);
  });
}

module.exports = app;
