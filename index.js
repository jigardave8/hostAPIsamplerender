const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Set up SQLite Database
const db = new sqlite3.Database('./database.db');

// Initialize the database table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      message TEXT
    )
  `);
});

// Make database accessible in routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An internal server error occurred.' });
});

// Start the server
app.listen(port, () => {
  console.log(`API running at http://localhost:${port}`);
});
