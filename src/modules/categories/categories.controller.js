import { Category } from "../../../DB/models/category.model.js";
import cloudinary from "../../utils/cloudinary.js";

export const createCategory = async (req, res, next) => {
  const isCategory = await Category.findOne({
    $or: [
      { categoryNameEN: req.body.categoryNameEN },
      { categoryNameAR: req.body.categoryNameAR },
    ],
  });
  if (isCategory) {
    return next(new Error("Category Already Exists"));
  }
  if (!req.file) {
    return next(new Error("Category Image Is Required"));
  }
  let { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Share3Masr/Categories/${req.body.categoryNameEN}`,
    }
  );
  await Category.create({
    categoryNameEN: req.body.categoryNameEN,
    categoryNameAR: req.body.categoryNameAR,
    image: {
      secure_url,
      public_id,
    },
  });
  return res.json({ success: true, message: "Category Created Successfully" });
};

export const getCategories = async (req, res, next) => {
  const categories = await Category.find();
  return res.json({ success: true, categories });
};

export const deleteCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new Error("Category Not Found"));
  }
  await cloudinary.uploader.destroy(category.image.public_id);
  await category.deleteOne();
  return res.json({ success: true, message: "Category Deleted Successfully" });
};

export const updateCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new Error("Category Not Found"));
  }
  if (!req.file && !req.body.categoryNameEN && !req.body.categoryNameAR) {
    return next(new Error("At Least One Field Is Required"));
  }
  if (req.file) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: category.image.public_id,
      }
    );
    category.image = {
      secure_url,
      public_id,
    };
  }
  if (req.body.categoryNameEN) {
    category.categoryNameEN = req.body.categoryNameEN;
  }
  if (req.body.categoryNameAR) {
    category.categoryNameAR = req.body.categoryNameAR;
  }
  await category.save();
  return res.json({ success: true, message: "Category Updated Successfully" });
};
