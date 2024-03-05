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
