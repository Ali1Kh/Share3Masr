import cloudinary from "../../utils/cloudinary.js";
import { customAlphabet } from "nanoid";
import bcrypt from "bcrypt";
import { Resturant } from "../../../DB/models/resturant.model.js";

export const createResturant = async (req, res, next) => {
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
  const resturants = await Resturant.find().select("-password -__v");
  return res.json({ success: true, resturants });
};