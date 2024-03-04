import express from "express";
import dotenv from "dotenv";
import { connectMongo } from "./DB/connection.js";
import areaRouter from "./src/modules/area/area.router.js";
import userRouter from "./src/modules/user/user.router.js";
import cors from "cors";
dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
await connectMongo();

app.use("/user", userRouter);
app.use("/area", areaRouter);

app.all("/uptime", (req, res) => {
    console.log("Up Time Requested");
    res.status(200).send("success");
  });

  
app.all("*", (req, res, next) => res.send("Api End Point Not Found"));

app.use((error, req, res, next) => {
  return res.json({
    success: false,
    errors: { error: error.message, stack: error.stack },
  });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
