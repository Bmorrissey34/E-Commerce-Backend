const router = require('express').Router();
const {
  Category,
  Product
} = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const allCategoriesData = await Category.findAll({
      include: [{
        model: Product,
        as: 'products'
      }]
    });
    res.status(200).json(allCategoriesData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const singleCategoryData = await Category.findByPk(req.params.id, {
      include: [{
        model: Product
      }]
    });

    if (!singleCategoryData) {
      res.status(404).json({
        message: 'No category ID found with that id!'
      });
      return;
    }

    res.status(200).json(singleCategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});
//Updates a category
router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const changedCategory = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    res.status(200).json(changedCategory);
  } catch (err) {
    console.log(err)
    res.status(400).json(err);
  }
});

//Deletes a category
router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.destroy({
      where: {
        id: req.params.id,
      },
    })
    if (!deletedCategory) {
      res.status(404).json({
        message: 'No product found with that id!'
      });
      return;
    } else
      res.status(200).json(deletedCategory);
    res.json(deletedCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;