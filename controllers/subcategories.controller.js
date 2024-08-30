const SubCategories = require('../models/subcategories.model'); // Import SubCategories model
const Categories = require('../models/categories.model');
const Artist = require('../models/artist.model');
const Songs =require("../models/song.model")

// const createsubCategories = async (req, res) => {
//   try {
//     // Check if the required fields are present in the request body
//     if (!req.body.CategoriesName || !req.body.SubCategoriesName || !req.file) {
//       return res.status(400).send({
//         error_code: 400,
//         message: "CategoriesName, SubCategoriesName, and image are required"
//       });
//     }

//     let obj = {
//       CategoriesName: req.body.CategoriesName,
//       SubCategoriesName: req.body.SubCategoriesName,
//       image: {
//         fileName: req.file.filename,
//         fileAddress: req.file.path
//       }
//     };

//     // Save 'obj' to the database
//     const newSubCategories = await SubCategories.create(obj);

//     // Return a success response with the newly created category
//     return res.status(201).send({
//       error_code: 200,
//       message: 'SubCategories Created',
//       category: newSubCategories
//     });
//   } catch (err) {
//     console.log('Error inside create SubCategories Controller', err);
//     return res.status(500).send({
//       error_code: 500,
//       message: 'Internal Server Error'
//     });
//   }
// };

const createsubCategories = async (req, res) => {
  try {
    const category = await Categories.findOne({ _id: req.body.CategoriesId });

    if (!category) {
      return res.status(404).send({
        error_code: 404,
        message: "Category not found"
      });
    }

    // Construct the image URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imagePath = `uploads/${req.file.filename}`;
    const imageUrl = `${baseUrl}/${imagePath}`;

    const newSubCategory = new SubCategories({
      CategoriesId: category._id,
      SubCategoriesName: req.body.SubCategoriesName,
      image: {
        fileName: req.file.filename,
        fileAddress: req.file.filename,
        imageUrl: imageUrl
      }
    });

    await newSubCategory.save();

    return res.status(201).send({
      error_code: 200,
      message: 'Subcategory Created',
      subcategory: newSubCategory
    });
  } catch (err) {
    console.log('Error inside create SubCategory Controller', err);
    return res.status(500).send({
      error_code: 500,
      message: 'Internal Server Error'
    });
  }
};


// ------------------------------------------


// const updateSubCategories = async (req, res) => {
//   try {
//     const { subCatid } = req.body;
//     const { CategoriesId, SubCategoriesName } = req.body;

//     // Check if CategoriesId is provided
//     if (!CategoriesId) {
//       return res.status(400).json({
//         error_code: 400,
//         message: "CategoriesId is required"
//       });
//     }

//     // Check if the category exists
//     const category = await Categories.findById(CategoriesId);
//     if (!category) {
//       return res.status(404).json({
//         error_code: 404,
//         message: "Category not found"
//       });
//     }

//     // Prepare update object
//     const updateObject = { CategoriesId, SubCategoriesName };
//     if (req.file) {
//       // Construct image URL
//       const baseUrl = `${req.protocol}://${req.get('host')}`;
//       const imagePath = `uploads/${req.file.filename}`;
//       const imageUrl = `${baseUrl}/${imagePath}`;

//       updateObject.image = {
//         fileName: req.file.filename,
//         fileAddress: req.file.path,
//         imageUrl: imageUrl
//       };
//     }

//     // Find and update the subcategory
//     const updatedSubCategories = await SubCategories.findByIdAndUpdate(subCatid, updateObject, { new: true });

//     // Check if the subcategory exists
//     if (!updatedSubCategories) {
//       return res.status(404).json({
//         error_code: 404,
//         message: "SubCategories not found"
//       });
//     }

//     // Return a success response with the updated subcategory
//     return res.status(200).json({
//       error_code: 200,
//       message: "SubCategories updated",
//       category: updatedSubCategories
//     });
//   } catch (err) {
//     console.error('Error inside update SubCategories Controller', err);
//     return res.status(500).json({
//       error_code: 500,
//       message: 'Internal Server Error'
//     });
//   }
// };
// --------------------------------------------------------

const updateSubCategories = async (req, res) => {
  try {
    const { subCatid, SubCategoriesName } = req.body;

    if (!subCatid) {
      return res.status(400).json({
        error_code: 400,
        message: "subCatid is required"
      });
    }

    if (!SubCategoriesName) {
      return res.status(400).json({
        error_code: 400,
        message: "SubCategoriesName is required"
      });
    }


    const updateObject = { SubCategoriesName };
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const imagePath = `uploads/${req.file.filename}`;
      const imageUrl = `${baseUrl}/${imagePath}`;

      updateObject.image = {
        fileName: req.file.filename,
        fileAddress: req.file.path,
        imageUrl: imageUrl
      };
    }

    const updatedSubCategories = await SubCategories.findByIdAndUpdate(subCatid, updateObject, { new: true });

    if (!updatedSubCategories) {
      return res.status(404).json({
        error_code: 404,
        message: "SubCategories not found"
      });
    }

    return res.status(200).json({
      error_code: 200,
      message: "SubCategories updated",
      category: updatedSubCategories,
    });
  } catch (err) {
    console.error('Error inside update SubCategories Controller', err);
    return res.status(500).json({
      error_code: 500,
      message: 'Internal Server Error'
    });
  }
};

// ---------------------------------------

const deleteMany = async (req, res) => {
  try {
    const deleted = await Songs.deleteMany({}); // Passing an empty filter object deletes all documents
    res.status(200).json({
      error_code: 200,
      message: 'All categories deleted successfully',
      deleted
    });
  } catch (err) {
    console.error('Error inside deleteMany Controller', err);
    res.status(500).json({
      error_code: 500,
      message: 'Internal Server Error'
    });
  }
};



const deleteSubCategories = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the subcategory
    const deletedSubCategories = await SubCategories.findByIdAndDelete(id);

    // Check if the subcategory exists
    if (!deletedSubCategories) {
      return res.status(404).send({
        error_code: 404,
        message: "SubCategories not found"
      });
    }

    // Return a success response
    return res.status(200).send({
      error_code: 200,
      message: "SubCategories deleted"
    });
  } catch (err) {
    console.log('Error inside delete SubCategories Controller', err);
    return res.status(500).send({
      error_code: 500,
      message: 'Internal Server Error'
    });
  }
};

// ---------------------------------------------

// const getSubCategories = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 5;
//     const skip = (page - 1) * limit;
//     const searchQuery = req.query.search || '';

//     const subcategories = await SubCategories.find({
//       SubCategoriesName: { $regex: searchQuery, $options: 'i' }
//     })
//       .populate('CategoriesId') // Populate the 'CategoriesId' field
//       .skip(skip)
//       .limit(limit);
//     const populatedSubcategories = subcategories.map(subcategory => ({
//       _id: subcategory._id,
//       SubCategoriesName: subcategory.SubCategoriesName,
//       image: subcategory.image,
//       status: subcategory.status,
//       CategoriesId: subcategory.CategoriesId ? subcategory.CategoriesId._id : null, // Reference the category ID if it exists
//       categoryName: subcategory.CategoriesId ? subcategory.CategoriesId.name : null // Display category name if it exists
//     }));
//     console.log("🚀 ~ populatedSubcategories ~ populatedSubcategories:", populatedSubcategories)

//     const totalCount = await SubCategories.countDocuments({
//       SubCategoriesName: { $regex: searchQuery, $options: 'i' }
//     });

//     res.status(200).json({
//       error_code: 200,
//       message: 'Subcategories retrieved successfully',
//       subcategories: populatedSubcategories,
//       total_count: totalCount,
//       page,
//       limit
//     });
//   } catch (err) {
//     console.error('Error inside get SubCategories Controller', err);
//     res.status(500).json({
//       error_code: 500,
//       message: 'Internal Server Error'
//     });
//   }
// };

// ---------------------------------

const getSubCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.search || '';

    const matchQuery = {
      SubCategoriesName: { $regex: searchQuery, $options: 'i' },
      'CategoriesId.deleted': { $ne: true },
      'deleted': { $ne: true }
    };

    console.log('Match Query:', matchQuery);

    const subcategories = await SubCategories.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: 'categories',
          localField: 'CategoriesId',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 1,
          SubCategoriesName: 1,
          status: 1,
          categoryName: '$category.name',
          imageUrl: { $ifNull: ['$image.imageUrl', null] }
        }
      },
      { $skip: skip },
      { $limit: limit },
      { $group: { _id: null, subcategories: { $push: '$$ROOT' } } }, // Group all documents into a single array
      { $project: { subcategories: 1, totalCount: { $size: '$subcategories' } } } // Calculate total count
    ]);

    if (!subcategories || subcategories.length === 0) {
      return res.status(404).json({
        error_code: 404,
        message: 'No subcategories found'
      });
    }

    const totalCount = subcategories[0].totalCount;

    res.status(200).json({
      error_code: 200,
      message: 'Subcategories retrieved successfully',
      subcategories: subcategories[0].subcategories,
      total_count: totalCount,
      page,
      limit
    });
  } catch (err) {
    console.error('Error inside get SubCategories Controller', err);
    res.status(500).json({
      error_code: 500,
      message: 'Internal Server Error'
    });
  }
};










// --------------------------------------------

const changeSubCategoryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategoryData = await SubCategories.findById(id);
    if (!subCategoryData) {
      return res.status(400).send({
        error_code: 400,
        message: 'Ads not found'
      });
    }

    subCategoryData.status = subCategoryData.status === 'activate' ? 'deactivate' : 'activate';

    await subCategoryData.save();
    res.status(200).send({
      message: `ads status toggled successfully to ${subCategoryData.status}`,
      subCategoryData: subCategoryData
    });
  } catch (err) {
    console.error('Error inside update admin', err);
    res.status(500).send({
      error_code: 500,
      message: 'Internal Server Error'

    });
  }
};

const getCategories = async (req, res) => {
  try {
    const { CategoriesId } = req.params;


    const categories = await SubCategories.find({ CategoriesId: CategoriesId });
    console.log("🚀 ~ getCategories ~ categories:", categories)
    if (!categories || categories.length === 0) {
      return res.status(400).send({
        error_code: 400,
        message: 'Categories not found for the given category ID'
      });
    }

    // Return the found categories
    res.status(200).json({
      error_code: 200,
      message: 'Categories retrieved successfully',
      categories: categories
    });

  } catch (err) {
    console.error('Error inside getCategories', err);
    res.status(500).send({
      error_code: 500,
      message: 'Internal Server Error'
    });
  }
};

// ------------------------------------------------

// const getSubCategoriesfromCategory = async (req, res) => {
//   try {
//     const { CategoriesId } = req.params;

//     const categories = await SubCategories.find({ CategoriesId: CategoriesId });

//     if (!categories || categories.length === 0) {
//       return res.status(400).json({
//         error_code: 400,
//         message: 'Categories not found for the given category ID'
//       });
//     }

//     const categoriesWithImageUrl = categories.map(category => ({
//       _id: category._id,
//       SubCategoriesName: category.SubCategoriesName,
//       imageUrl: category.image ? category.image.imageUrl : null,
//       status: category.status,
//       CategoriesId: category.CategoriesId,
//       categoryName: category.categoryName
//     }));

//     res.status(200).json({
//       error_code: 200,
//       message: 'Categories retrieved successfully',
//       categories: categoriesWithImageUrl
//     });

//   } catch (err) {
//     console.error('Error inside getCategories', err);
//     res.status(500).json({
//       error_code: 500,
//       message: 'Internal Server Error'
//     });
//   }
// };

// ------------------------------------------------



module.exports = {
  createsubCategories,
  updateSubCategories,
  deleteSubCategories,
  getSubCategories,
  deleteMany,
  changeSubCategoryStatus,
  getCategories

};
