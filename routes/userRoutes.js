const express = require('express');
const router = express.Router();
const db = require('../db.js'); // Import the database connection

// GET all users
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM User');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: Unable to retrieve users, reasom: ' + err.message);
  }
});

// GET a user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM User WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST a new user
router.post('/', async (req, res) => {
  const { name, email, pushNotificationToken, userType, uid, photoUrl, phoneNumber } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO User (name, email, pushNotificationToken, userType, uid, photoUrl, phoneNumber) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, email, pushNotificationToken, userType, uid, photoUrl, phoneNumber]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/checkUser/:uid', async (req, res) => {
  const { uid } = req.params;
  try {
    const result = await db.query('SELECT * FROM User WHERE uid = $1', [uid]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'false' });
    }
    res.json({ message: 'true' });
  } catch (err) {
    console.error(err.message);
    //send all columns of the user
    const columns = await db.query('SELECT * FROM User');
    const columnNames = columns.rows.map((column) => column.column_name);
    res.status(500).send('Server Error" message: columns available: ' + columnNames);
  }
});

// PUT (update) a user by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, pushNotificationToken, userType, uid } = req.body;
  try {
    const result = await db.query(
      'UPDATE User SET name = $1, email = $2, pushNotificationToken = $3, userType = $4, uid = $5 WHERE id = $6 RETURNING *',
      [name, email, pushNotificationToken, userType, uid, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE a user by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM User WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
