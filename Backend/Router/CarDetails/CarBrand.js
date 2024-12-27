const express = require('express');
const router = express.Router();
const MainCategory = require('../../Model/CarDetails/CarBrand/Carbrand');



router.post('/addMainCategory',async (req, res) => {
  try {
      const { name } = req.body;

      // Check if a MainCategory with the same name already exists
      const existingMainCategory = await MainCategory.findOne({ name });

      if (existingMainCategory) {
          // If a MainCategory with the same name exists, send an error response
          return res.status(400).json({ error: 'MainCategory with this name already exists' });
      }

      // Create a new MainCategory with the name and image URL
      const mainCategory = new MainCategory({
          name: name,
      });

      // Save the MainCategory to the database
      await mainCategory.save();

      res.status(201).json(mainCategory);
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
});



router.put('/MainCategory/:MainCategoryId', async (req, res) => {
  try {
    const mainCategoryId = req.params.MainCategoryId;
    const mainCategory = await MainCategory.findById(mainCategoryId);

    if (!mainCategory) {
      return res.status(404).json({ message: 'MainCategory not found' });
    }

    // Update the name if provided in the request body
    if (req.body.name) {
      mainCategory.name = req.body.name;
    }

    const updatedMainCategory = await mainCategory.save();

    res.status(200).json({ updatedMainCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/getMainCategories', async (req, res) => { // Renamed the route
  try {
    // Retrieve all MainCategories from the database
    const mainCategories = await MainCategory.find();

    res.json(mainCategories);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete a MainCategory
router.delete('/MainCategory/:MainCategoryId', async (req, res) => {
  try {
    const { MainCategoryId } = req.params;

    // Find the MainCategory by ID and remove it
    const deletedMainCategory = await MainCategory.findByIdAndDelete(MainCategoryId);

    if (!deletedMainCategory) {
      return res.status(404).json({ error: 'MainCategory not found' });
    }

    res.json({ message: 'MainCategory deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


const Category = require('../../Model/CarDetails/CarBrand/CarModel'); // Import your Category model

// Route to add a new category
router.post('/addCategory', async (req, res) => {
  try {
    const { name, parentCategory } = req.body;

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists.' });
    }

    // Create a new category
    const category = new Category({ name, parentCategory });
    await category.save();

    res.status(201).json({ message: 'Category added successfully.' });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Error adding category.' });
  }
});

// Route to get categories by parent category
router.get('/getCategoriesByParent/:parentCategory', async (req, res) => {
  try {
    const parentCategory = req.params.parentCategory;
    const categories = await Category.find({ parentCategory });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories.' });
  }
});



// Route to get categories by parent category or categories
router.get('/getCategoriesByParent', async (req, res) => {
  try {
    let parentCategories = req.query.parentCategories;

    // Ensure parentCategories is an array
    if (!Array.isArray(parentCategories)) {
      parentCategories = [parentCategories];
    }

    if (parentCategories.length === 0) {
      return res.status(400).json({ message: 'Invalid or missing parentCategories parameter.' });
    }

    const categories = await Category.find({ parentCategory: { $in: parentCategories } });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories.' });
  }
});




// Route to update a category
router.put('/updateCategory/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, parentCategory } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, parentCategory },
      { new: true } // To get the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Error updating category.' });
  }
});



router.delete('/deleteCategory/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Check if the category exists
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.json({ message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Error deleting category.' });
  }
});





module.exports = router;




