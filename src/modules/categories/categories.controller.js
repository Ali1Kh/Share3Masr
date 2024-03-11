import { Category } from "../../../DB/models/category.model.js";
import cloudinary from "../../utils/cloudinary.js";

export const createCategory = async (req, res, next) => {
  const isCategory = await Category.findOne({
    categoryName: req.body.categoryName,
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
      folder: `Share3Masr/Categories/${req.body.categoryName}`,
    }
  );
  await Category.create({
    categoryName: req.body.categoryName,
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
  category.deleteOne();
  await cloudinary.uploader.destroy(category.image.public_id);
  await category.save();
  return res.json({ success: true, message: "Category Deleted Successfully" });
};

export const updateCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new Error("Category Not Found"));
  }
  if (!req.file && !req.body.categoryName) {
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
  if (req.body.categoryName) {
    category.categoryName = req.body.categoryName;
  }
  await category.save();
  return res.json({ success: true, message: "Category Updated Successfully" });
};
