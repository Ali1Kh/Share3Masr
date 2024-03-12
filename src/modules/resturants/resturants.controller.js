import cloudinary from "../../utils/cloudinary.js";
import { customAlphabet } from "nanoid";
import bcrypt from "bcrypt";
import { Resturant } from "../../../DB/models/resturant.model.js";
import { Area } from "../../../DB/models/area.model.js";
import { Category } from "../../../DB/models/category.model.js";

export const createResturant = async (req, res, next) => {
  let isArea = await Area.findById(req.body.area);
  if (!isArea) return next(new Error("Area Not Found"));

  let isCategory = await Category.findById(req.body.category);
  if (!isCategory) return next(new Error("Category Not Found"));

  const isResturant = await Resturant.findOne({
    phone: { $in: req.body.phone },
  });
  if (isResturant) {
    return next(new Error("Resturant Already Exists"));
  }

  const hashedPass = await bcrypt.hashSync(
    req.body.password,
    parseInt(process.env.SALT_ROUND)
  );

  if (!req.file) {
    return next(new Error("Resturant Image Is Required"));
  }
  let folderId = customAlphabet("12345", 3);
  let cloudFolderId = folderId();
  let { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `Share3Masr/Resturants/${req.body.name}${cloudFolderId}`,
    }
  );
  await Resturant.create({
    ...req.body,
    password: hashedPass,
    image: {
      secure_url,
      public_id,
    },
  });
  return res.json({ success: true, message: "Resturant Created Successfully" });
};

export const getResturants = async (req, res, next) => {
  const resturants = await Resturant.find()
    .populate(["area", "category"])
    .select("-password -__v");
  return res.json({ success: true, resturants });
};

export const deleteResturant = async (req, res, next) => {
  const resturant = await Resturant.findById(req.params.id);
  if (!resturant) {
    return next(new Error("Resturant Not Found"));
  }
  await cloudinary.uploader.destroy(resturant.image.public_id);
  await resturant.deleteOne();
  return res.json({ success: true, message: "Resturant Deleted Successfully" });
};

export const getResturantSubCategories = async (req, res, next) => {
  const resturant = await Resturant.findById(req.params.id);
  if (!resturant) {
    return next(new Error("Resturant Not Found"));
  }
  return res.json({ success: true, subCategories: resturant.subCategories });
};
