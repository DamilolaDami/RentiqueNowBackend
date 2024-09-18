const express = require('express');
const router = express.Router();

// GET all users
router.get('/', async (req, res, next) => {
  try {
    const users = await req.prisma.user.findMany();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET a user by ID
router.get('/:uid', async (req, res, next) => {
  try {
    const user = await req.prisma.user.findUnique({
      where: { uid: req.params.uid },
    });
    res.json(user);
  }
  catch (err) {
    next(err);
  }
});

// POST a new user
router.post('/', async (req, res, next) => {
  try {
    const newUser = await req.prisma.user.create({
      data: req.body,
    });
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

// Check if a user exists by uid
router.get('/checkUser/:uid', async (req, res, next) => {
  try {
    const user = await req.prisma.user.findUnique({
      where: { uid: req.params.uid },
    });
    res.json({ exists: !!user });
  } catch (err) {
    next(err);
  }
});

// PUT (update) a user by ID
router.put('/:id', async (req, res, next) => {
  try {
    const updatedUser = await req.prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
});

// DELETE a user by ID
router.delete('/:id', async (req, res, next) => {
  try {
    await req.prisma.user.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;