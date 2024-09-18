const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: Unable to retrieve users');
  }
});

// GET a user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST a new user
router.post('/', async (req, res) => {
  const { name, email, pushNotificationToken, userType, uid, photoUrl, phoneNumber } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        pushNotificationToken,
        userType,
        uid,
        photoUrl,
        phoneNumber,
      },
    });
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Check if a user exists by uid
router.get('/checkUser/:uid', async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { uid },
    });
    res.json({ exists: !!user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// PUT (update) a user by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, pushNotificationToken, userType, uid, photoUrl, phoneNumber } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        pushNotificationToken,
        userType,
        uid,
        photoUrl,
        phoneNumber,
      },
    });
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE a user by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;