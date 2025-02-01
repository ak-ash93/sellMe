import mongoose from "mongoose";
import Product from "../modals/product.modal.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynHandler.js";

export const createProduct = asyncHandler(async (req, res, next) => {
  const product = req.body;

  if (!product.name || !product.price || !product.image) {
    return ApiResponse.formatResponse(
      res,
      400,
      "Please provide all required fields: name, price, image"
    );
  }

  const newProduct = new Product(product);

  try {
    await newProduct.save();
    return ApiResponse.formatResponse(
      res,
      201,
      "Product created successfully",
      newProduct
    );
  } catch (error) {
    next(new ApiError(500, "Failed to save product", [error.message]));
  }
});

export const getProduct = asyncHandler(async (req, res, next) => {
  try {
    const products = await Product.find({});
    return ApiResponse.formatResponse(
      res,
      200,
      "Products fetched successfully",
      products
    );
  } catch (error) {
    next(new ApiError(500, "Failed to fetch the products", [error.message]));
  }
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedProducts = await Product.findByIdAndDelete(id);

    if (!deletedProducts) {
      return next(new ApiError(404, "Product not found"));
    }
    return ApiResponse.formatResponse(res, 200, "Product deleted successfully");
  } catch (error) {
    next(new ApiError(500, "Failed to delete product", [error.message]));
  }
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = req.body;

  try {
    // First, check if the product ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid product id"));
    }
    // Try to update the product
    const updateProduct = await Product.findByIdAndUpdate(id, product, {
      new: true, // This option returns the updated document
    });
    // If no product was found to update, return a 404 error
    if (!updateProduct) {
      return next(new ApiError(404, "Product not found"));
    }
    // If the product was successfully updated, return the updated product
    return ApiResponse.formatResponse(
      res,
      200,
      "Product updated successfully",
      updateProduct
    );
  } catch (error) {
    next(new ApiError(500, "Failed to update product", [error.message]));
  }
});
