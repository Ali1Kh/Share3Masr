import mongoose from "mongoose";
export const connectMongo = async () => {
  await mongoose
    .connect(process.env.MONGOURL)
    .then(() => console.log("Connected To MongoDB Successfuly"))
    .catch((err) => console.error(err));
};
