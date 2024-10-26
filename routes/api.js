const express = require('express');
const router = express.Router();

// POST request to add data
router.post('/data', (req, res) => {
  const { name, message } = req.body;
  const db = req.db;

  db.run('INSERT INTO data (name, message) VALUES (?, ?)', [name, message], function (err) {
    if (err) {
      res.status(500).json({ message: 'Failed to add data.' });
    } else {
      res.json({ message: 'Data added successfully!', id: this.lastID });
    }
  });
});

// GET request to retrieve all data
router.get('/data', (req, res) => {
  const db = req.db;

  db.all('SELECT * FROM data', (err, rows) => {
    if (err) {
      res.status(500).json({ message: 'Failed to retrieve data.' });
    } else {
      res.json(rows);
    }
  });
});

// PUT request to update data by name
router.put('/data/:name', (req, res) => {
  const { name } = req.params;
  const { message } = req.body;
  const db = req.db;

  db.run('UPDATE data SET message = ? WHERE name = ?', [message, name], function (err) {
    if (err) {
      res.status(500).json({ message: 'Failed to update data.' });
    } else if (this.changes === 0) {
      res.status(404).json({ message: 'Data not found!' });
    } else {
      res.json({ message: 'Data updated successfully!' });
    }
  });
});

// DELETE request to delete data by name
router.delete('/data/:name', (req, res) => {
  const { name } = req.params;
  const db = req.db;

  db.run('DELETE FROM data WHERE name = ?', [name], function (err) {
    if (err) {
      res.status(500).json({ message: 'Failed to delete data.' });
    } else if (this.changes === 0) {
      res.status(404).json({ message: 'Data not found!' });
    } else {
      res.json({ message: 'Data deleted successfully!' });
    }
  });
});

module.exports = router;
