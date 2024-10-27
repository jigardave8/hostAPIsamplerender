const express = require('express');
const router = express.Router();

// POST request to add data
router.post('/data', (req, res) => {
  const { name, message } = req.body;
  const db = req.db;

  const stmt = db.prepare('INSERT INTO data (name, message) VALUES (?, ?)');
  const info = stmt.run(name, message);
  
  res.json({ message: 'Data added successfully!', id: info.lastInsertRowid });
});

// GET request to retrieve all data
router.get('/data', (req, res) => {
  const db = req.db;

  const rows = db.prepare('SELECT * FROM data').all();
  res.json(rows);
});

// PUT request to update data by name
router.put('/data/:name', (req, res) => {
  const { name } = req.params;
  const { message } = req.body;
  const db = req.db;

  const stmt = db.prepare('UPDATE data SET message = ? WHERE name = ?');
  const result = stmt.run(message, name);

  if (result.changes === 0) {
    res.status(404).json({ message: 'Data not found!' });
  } else {
    res.json({ message: 'Data updated successfully!' });
  }
});

// DELETE request to delete data by name
router.delete('/data/:name', (req, res) => {
  const { name } = req.params;
  const db = req.db;

  const stmt = db.prepare('DELETE FROM data WHERE name = ?');
  const result = stmt.run(name);

  if (result.changes === 0) {
    res.status(404).json({ message: 'Data not found!' });
  } else {
    res.json({ message: 'Data deleted successfully!' });
  }
});

module.exports = router;
