import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoute from "./routes/authRoute.js";
import blogRoute from "./routes/blogRoute.js";
import donationRoute from "./routes/donationRoute.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/blog", blogRoute);
app.use("/donate", donationRoute);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  )
  .catch((err) => console.log(err));
