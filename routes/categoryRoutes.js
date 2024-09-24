const express = require('express');
const router = express.Router();
const multer = require('multer');


const upload = multer();
// GET all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await req.prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

// GET a category by ID
router.get('/:autoId', async (req, res, next) => {
  try {
    const category = await req.prisma.category.findUnique({
      where: { autoId: parseInt(req.params.autoId) },
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
});

// POST a new categorie
router.post('/', upload.none(), async (req, res, next) => {
    console.log(req.body);
  try {
    const { name, imageUrl } = req.body;
    const newCategory = await req.prisma.category.create({
      data: {
        name,
        imageUrl,
      },
    });
    res.status(201).json(newCategory);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// PUT (update) a category by ID
router.put('/:autoId', async (req, res, next) => {
  try {
    const category = await req.prisma.category.update({
      where: { autoId: parseInt(req.params.autoId) },
      data: req.body,
    });
    res.json(category);
  } catch (err) {
    next(err);
  }
});

// DELETE a category by ID
router.delete('/:autoId', async (req, res, next) => {
  try {
    await req.prisma.category.delete({
      where: { autoId: parseInt(req.params.autoId) },
    });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
});

router.post('/subcategories', upload.none(), async (req, res, next) => {
  try {
    const { name, imageUrl, categoryId } = req.body;
    const newSubcategory = await req.prisma.subcategory.create({
      data: {
        name,
        imageUrl,
        category: { connect: { autoId: parseInt(categoryId) } }, 
      },
    });
    res.status(201).json(newSubcategory);
  } catch (err) {
    next(err);
  }
});

router.get('/subcategories/:autoId', async (req, res, next) => {
  try {
    const subcategory = await req.prisma.subcategory.findUnique({
      where: { autoId: parseInt(req.params.autoId) },
      include: { category: false },
    });
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.json(subcategory);
  } catch (err) {
    next(err);
  }
});

//get all subcategories of a category by passing categoryId
router.get('/allSubcategories/:autoId', async (req, res, next) => {
  try {
    const subcategories = await req.prisma.subcategory.findMany({
      where: { categoryId: parseInt(req.params.autoId) },
    });
    res.json(subcategories);
  } catch (err) {
    next(err);
  }
});


module.exports = router;
