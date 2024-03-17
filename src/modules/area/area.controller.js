import { Area } from "../../../DB/models/area.model.js";

export const createArea = async (req, res, next) => {
  const isArea = await Area.findOne({
    $or: [
      { areaNameEN: req.body.areaNameEN },
      {
        areaNameAR: req.body.areaNameAR,
      },
    ],
  });
  if (isArea) {
    return next(new Error("Area Already Exists"));
  }
  await Area.create(req.body);
  return res.json({ success: true, message: "Area Created Successfully" });
};

export const getAreas = async (req, res, next) => {
  const areas = await Area.find();
  return res.json({ success: true, areas });
};

export const updateArea = async (req, res, next) => {
  const isArea = await Area.findById(req.params.id);
  if (!isArea) {
    return next(new Error("Area Not Found"));
  }

  const areaNameExits = await Area.findOne({
    $or: [
      { areaNameEN: req.body.areaNameEN },
      {
        areaNameAR: req.body.areaNameAR,
      },
    ],
  });
  if (areaNameExits) {
    return next(new Error("New Area Already Exists"));
  }

  isArea.areaNameEN = req.body.areaNameEN;
  isArea.areaNameAR = req.body.areaNameAR;
  await isArea.save();
  return res.json({ success: true, message: "Area Updated Successfully" });
};

export const deleteArea = async (req, res, next) => {
  const isArea = await Area.findById(req.params.id);
  if (!isArea) {
    return next(new Error("Area Not Found"));
  }

  await isArea.deleteOne();
  return res.json({ success: true, message: "Area Deleted Successfully" });
};
