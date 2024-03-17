import cloudinary from "../../utils/cloudinary.js";
import { customAlphabet } from "nanoid";
import bcrypt from "bcrypt";
import { Resturant } from "../../../DB/models/resturant.model.js";
import { Area } from "../../../DB/models/area.model.js";
import { Category } from "../../../DB/models/category.model.js";
import { Product } from "../../../DB/models/product.model.js";

export const createResturant = async (req, res, next) => {
  // let isArea = await Area.findById(req.body.area);
  // if (!isArea) return next(new Error("Area Not Found"));

  for (let index = 0; index < req.body.category.length; index++) {
    let isCategory = await Category.findById(req.body.category[index]);
    if (!isCategory) return next(new Error("Category Not Found"));
  }

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
  const resturants = await Resturant.find({ isDeleted: false })
    .populate(["area", "category"])
    .select("-password -__v");
  return res.json({ success: true, resturants });
};

export const deleteResturant = async (req, res, next) => {
  const resturant = await Resturant.findById(req.params.id);
  if (!resturant) {
    return next(new Error("Resturant Not Found"));
  }

  if (resturant.isDeleted) {
    return next(new Error("Resturant Is Already Deleted"));
  }

  resturant.isDeleted = true;
  await resturant.save();
  await Product.updateMany({ resturant: resturant._id }, { isDeleted: true });

  return res.json({ success: true, message: "Resturant Deleted Successfully" });
};

export const getResturantSubCategories = async (req, res, next) => {
  const resturant = await Resturant.findById(req.params.id);
  if (!resturant) {
    return next(new Error("Resturant Not Found"));
  }
  return res.json({ success: true, subCategories: resturant.subCategories });
};

export const updateResturant = async (req, res, next) => {
  const resturant = await Resturant.findById(req.params.id);
  if (!resturant) {
    return next(new Error("Resturant Not Found"));
  }

  if (req.file) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: resturant.image.public_id,
      }
    );
    resturant.image = {
      secure_url,
      public_id,
    };
    await resturant.save();
  }
  if (req.body.password) {
    req.body.password = await bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.SALT_ROUND)
    );
  }
  await Resturant.findByIdAndUpdate(req.params.id, req.body);
  return res.json({ success: true, message: "Resturant Updated Successfully" });
};

export const getCategoryResturants = async (req, res, next) => {
  let isCategory = await Category.findById(req.params.id);
  if (!isCategory) return next(new Error("Category Not Found"));
  const resturants = await Resturant.find({
    category: req.params.id,
    isDeleted: false,
  });
  return res.json({ success: true, resturants });
};
