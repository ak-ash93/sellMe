import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./src/db/db.js";
import { ApiError } from "./src/utils/ApiError.js";
import productRoutes from "./src/routes/product.routes.js";

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/products", productRoutes);

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

app.listen(8000, () => {
  connectDb();
  console.log("Server is running on port 8000");
});
