const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const allProductData = await Product.findAll({
      include: [{ model: Category }, {model: Tag}]
    });
    res.status(200).json(allProductData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const singleProductData = await Product.findByPk(req.params.id,
      {
      include: [{model: Tag}]
      });
   
      if (!singleProductData) {
        res.status(404).json({ message: 'No category ID found with that id!' });
        return;
      }
    
    res.status(200).json(singleProductData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    console.log(req.body)
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: newProduct.id,
          tag_id
        };
      });
      console.log(productTagIdArr)
      const newTags = await ProductTag.bulkCreate(productTagIdArr);
    }
    res.status(200).json(newProduct);
  } catch (err) {
    res.status(400).json(err);
  }
})


// updates a product removes tags not included in the tagIds array, and adds new ones
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});
//Deletes a product and the tag relationships to that deleted product
router.delete('/:id', async (req, res) => {
    try{
      const deletedProduct= await Product.destroy({
        where: {
          id: req.params.id,
        },
      })
      const deletedTagRelationship= await ProductTag.destroy({
        where: {
          product_id: req.params.id,
        },
      })
      res.status(200).json(deletedProduct);
    }
  catch(err){
   res.status(500).json(err); 
  }
});

module.exports = router;