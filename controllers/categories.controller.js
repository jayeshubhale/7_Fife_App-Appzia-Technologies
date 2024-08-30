const Category = require('../models/categories.model');



const createCategories = async (req, res) => {
  try {

    console.log(req.body)
    const name =req.body;
    if (!req.body.name) {
      return res.status(400).send({
        error_code: 400,
        message: "Category name is required"
      });
    }

    let obj = {
      name: req.body.name ,
    };

    if (req.file) {
      obj["image"] = {
        fileName: req.file.filename,
        fileAddress: req.file.filename
      };

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const imagePath = `uploads/${req.file.filename}`;
      const imageUrl = `${baseUrl}/${imagePath}`;
      obj["imageUrl"] = imageUrl;
    }

    const newCategory = await Category.create(obj);

    return res.status(201).send({
      error_code: 200,
      message: "Categories created",
      category: newCategory
    });
  } catch (err) {
    console.log("Error inside create Categories Controller", err);
    return res.status(500).send({
      error_code: 500,
      message: "Internal Server Error"
    });
  }
};




// const updateCategories = async (req, res) => {
//   try {
//     const categoryId = req.params.id;

//     let category = await Category.findById(categoryId);

//     if (!category) {
//       return res.json({
//         error_code: 404,
//         message: "Category not found"
//       });
//     }

//     if (req.file) {
//       const baseUrl = `${req.protocol}://${req.get('host')}`;
//       const imagePath = `uploads/${req.file.filename}`;
//       const imageUrl = `${baseUrl}/${imagePath}`;
//       category.imageUrl = imageUrl;
//       category.image = {
//         fileName: req.file.filename,
//         fileAddress: req.file.path,
//       };
//     }
//     const updatedCategory = await category.save();
//     console.log("🚀 ~ updateCategories ~ updatedCategory:", updatedCategory)

//     return res.status(200).send({
//       error_code: 200,
//       message: "Category updated",
//       category: updatedCategory
//     });
//   } catch (err) {
//     console.log("Error inside update Categories Controller", err);
//     return res.status(500).send({
//       error_code: 500,
//       message: "Internal Server Error"
//     });
//   }
// };

// ----------------------------------------------
const updateCategories = async (req, res) => {
  try {
    const categoryId = req.params.id;

    let category = await Category.findById(categoryId);

    if (!category) {
      return res.json({
        error_code: 404,
        message: "Category not found"
      });
    }

    if (req.body.categoriesName) {
      category.name = req.body.categoriesName;
    }

    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const imagePath = `uploads/${req.file.filename}`;
      const imageUrl = `${baseUrl}/${imagePath}`;
      category.imageUrl = imageUrl;
      category.image = {
        fileName: req.file.filename,
        fileAddress: req.file.path,
      };
    }

    const updatedCategory = await category.save();
    console.log("updateCategories ~ updatedCategory:", updatedCategory);

    return res.status(200).send({
      error_code: 200,
      message: "Category updated",
      category: updatedCategory
    });
  } catch (err) {
    console.log("Error inside update Categories Controller", err);
    return res.status(500).send({
      error_code: 500,
      message: "Internal Server Error"
    });
  }
};
// -------------------------------------------


const deleteCategories = async (req, res) => {
  try {
    const categoryId = req.params.id; // Assuming you're passing category id in the request params

    // Find the category by id and remove it
    const deletedCategory = await Category.findByIdAndRemove(categoryId);

    // Check if the category exists
    if (!deletedCategory) {
      return res.status(404).send({
        error_code: 404,
        message: "Category not found"
      });
    }

    // Return success response with the deleted category
    return res.status(200).send({
      error_code: 200,
      message: "Category deleted",
      category: deletedCategory
    });
  } catch (err) {
    console.log("Error inside delete Categories Controller", err);
    return res.status(500).send({
      error_code: 500,
      message: "Internal Server Error"
    });
  }
};

const changeCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const CategoryData = await Category.findById(id);
    if (!CategoryData) {  
      return res.status(400).send({
        error_code: 400,
        message: 'Ads not found'
      });
    }

    CategoryData.status = CategoryData.status === 'activate' ? 'deactivate' : 'activate';

    await CategoryData.save();
    res.status(200).send({
      message: `ads status toggled successfully to ${CategoryData.status}`,
      CategoryData: CategoryData
    });
  } catch (err) {
    console.error('Error inside update admin', err);
    res.status(500).send({
      error_code: 500,
      message: 'Internal Server Error'
    });
  }
};

const getcategoriesPage = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5
    const skip = (page - 1) * limit;

    const searchQuery = req.query.search || '';

    const categories = await Category.find({
      name: { $regex: searchQuery, $options: 'i' }
    })
      .skip(skip)
      .limit(limit);
    console.log("🚀 ~ getCategories ~ categories:", categories)

    const totalCount = await Category.countDocuments({
      name: { $regex: searchQuery, $options: 'i' }
    });

    res.status(200).json({
      error_code: 200,
      message: 'Categories fetched successfully',
      categories,
      total_count: totalCount,
      page,
      limit
    });
  } catch (err) {
    console.error('Error inside getCategories Controller', err);
    res.status(500).json({
      error_code: 500,
      message: 'Internal Server Error'
    });
  }
};



const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({
      error_code: 200,
      message: 'Categories fetched successfully',
      categories: categories
    });
  } catch (err) {
    console.error('Error inside getCategories Controller', err);
    res.status(500).json({
      error_code: 500,
      message: 'Internal Server Error'
    });
  }
};

// const deleteMany = async (req, res) => {
//   try {
//     const deleted = await Category.deleteMany({}); // Passing an empty filter object deletes all documents
//     res.status(200).json({
//       error_code: 200,
//       message: 'All categories deleted successfully',
//       deleted
//     });
//   } catch (err) {
//     console.error('Error inside deleteMany Controller', err);
//     res.status(500).json({
//       error_code: 500,
//       message: 'Internal Server Error'
//     });
//   }
// };

module.exports = {
  createCategories,
  updateCategories,
  deleteCategories,
  changeCategoryStatus,
  getCategories,
  getcategoriesPage
};
