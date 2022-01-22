const router = require('express').Router();
const {
  Tag,
  Product,
  ProductTag
} = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const allTagsData = await Tag.findAll({
      include: [{
        model: Product
      }]
    });
    res.status(200).json(allTagsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const singleTagData = await Tag.findByPk(req.params.id, {
      include: [{
        model: Product
      }]
    });

    if (!singleTagData) {
      res.status(404).json({
        message: 'No category ID found with that id!'
      });
      return;
    }

    res.status(200).json(singleTagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(200).json(newTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  {
    try {
      const changedTag = await Tag.update(req.body, {
        where: {
          id: req.params.id,
        },
      })
      res.status(200).json(changedTag);
    } catch (err) {
      console.log(err)
      res.status(400).json(err);
    }
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    })
    const deletedTagRelationship = await ProductTag.destroy({
      where: {
        tag_id: req.params.id,
      },
    })
    res.status(200).json(deletedTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;