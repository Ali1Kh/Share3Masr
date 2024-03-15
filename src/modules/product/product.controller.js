import { Product } from "../../../DB/models/product.model.js";
import { Resturant } from "../../../DB/models/resturant.model.js";
import { Category } from "../../../DB/models/category.model.js";
import cloudinary from "../../utils/cloudinary.js";

export const createProduct = async (req, res, next) => {
  let isResturant = await Resturant.findById(req.body.resturant);
  if (!isResturant) return next(new Error("Resturant Not Found"));
  if (isResturant.isDeleted) {
    return next(new Error("Resturant Is Deleted"));
  }
  let isCategory = await Category.findById(req.body.category);
  if (!isCategory) return next(new Error("Category Not Found"));

  if (req.file) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `Share3Masr/ProductsImages/${isResturant.name}/${req.body.name}`,
      }
    );
    req.body.image = {
      secure_url,
      public_id,
    };
  }

  await Product.create(req.body);
  return res.json({ success: true, message: "Product Added Successfully" });
};

export const getProducts = async (req, res, next) => {
  let searchConditions = [];

  const regex = { $regex: req.query.search, $options: "i" };

  if (req.query.search) {
    searchConditions = [
      { name: regex },
      { description: regex },
      {
        "category.categoryName": regex,
      },
      {
        "resturant.name": regex,
      }
    ];
  }

  let query = {
    isDeleted: false,
    $or: searchConditions,
  };
  if (searchConditions.length == 0) {
    delete query.$or;
  }
  let products = await Product.find(query).populate([
    {
      path: "resturant",
      select: "name phone address openingTime closingTime",
    },
    "category",
    {
      path: "resturantSubCategory",
      select: "subCategories",
    },
  ]);

  products.map((product) => {
    let subCategory = product.resturantSubCategory[0]?.subCategories?.filter(
      (subCategoryItem) =>
        subCategoryItem._id.toString() == product.resturantCategory.toString()
    )[0];

    product.resturantSubCategory = subCategory;
  });

  return res.json({ success: true, count: products.length, products });
};

export const deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Error("Product Not Found"));
  }
  await product.deleteOne();
  return res.json({ success: true, message: "Product Deleted Successfully" });
};

export const updateProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new Error("Product Not Found"));
  }
  if (req.file) {
    if (product.image) {
      let { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
          public_id: product.image.public_id,
        }
      );
      req.body.image = {
        secure_url,
        public_id,
      };
    } else {
      let { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: `Share3Masr/ProductsImages/${isResturant.name}/${req.body.name}`,
        }
      );
      req.body.image = {
        secure_url,
        public_id,
      };
    }
  }
  await product.updateOne(req.body);
  return res.json({ success: true, message: "Product Updated Successfully" });
};
