import trycatch from "../utils/trycatch.js";
import Product from "../models/product.js";
import bufferGenerator from "../utils/bufferGenerator.js";
import cloudinary from "cloudinary";
import { create } from "domain";

export const createProduct = trycatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "You are not authorized to create a product" });
  }

  const { title, price, description, category, stock } = req.body;

  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  const imageUploadPromises = files.map(async (file) => {
    try {
      const filebuffer = bufferGenerator(file);
      const result = await cloudinary.v2.uploader.upload(filebuffer.content);
      return { id: result.public_id, url: result.secure_url };
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("Image upload failed");
    }
  });

  const uploadimages = await Promise.all(imageUploadPromises);

  const createproducts = await Product.create({
    title,
    price,
    description,
    category,
    stock,
    images: uploadimages,
  });

  res
    .status(201)
    .json({ message: "Product created successfully", createproducts });
});

export const getAllProducts = trycatch(async (req, res) => {
  const { search, category, page, sortbyprice } = req.query;

  const filter = {};

  if (search) {
    filter.title = {
      $regex: search,
      $options: "i",
    };
  }

  if (category) {
    filter.category = category;
  }

  const limit = 8;
  const skip = (page - 1) * limit;
  let sortoptions = { createdAt: -1 };

  if (sortbyprice) {
    if (sortbyprice === "lowtohigh") {
      sortoptions = { price: 1 };
    } else if (sortbyprice === "hightolow") {
      sortoptions = { price: -1 };
    }
  }

  const products = await Product.find(filter)
    .sort(sortoptions)
    .limit(limit)
    .skip(skip);

  const categories = await Product.distinct("category");
  const newproduct = await Product.find().sort({ createdAt: -1 }).limit(4);
  const countproduct = await Product.countDocuments();
  const totalpages = Math.ceil(countproduct / limit);

  res.status(200).json({ products, categories, newproduct, totalpages });
});

export const getsingleproduct = trycatch(async (req, res) => {
  const products = await Product.findById(req.params.id);

  const relatedproduct = await Product.find({
    _id: { $ne: products._id },
    category: products.category,
  }).limit(4);

  res.status(200).json({ products, relatedproduct });
});

export const updateProduct = trycatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "You are not authorized to update a product" });
  }

  const { title, price, description, category, stock } = req.body;

  const updateFields = {};

  if (title) updateFields.title = title;
  if (price) updateFields.price = price;
  if (description) updateFields.description = description;
  if (category) updateFields.category = category;
  if (stock) updateFields.stock = stock;

  const product = await Product.findByIdAndUpdate(req.params.id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.status(200).json({ message: "Product updated successfully", product });
});

export const updateproductimages = trycatch(async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "You are not authorized to update a product" });
  }
  const {id} = req.params;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const oldimages = product.images || [];

  for(const img of oldimages){
    if(img.id){
      await cloudinary.v2.uploader.destroy(img.id);
    }
    
  }

  const imageUploadPromises = files.map(async (file) => {
    try {
      const filebuffer = bufferGenerator(file);
      const result = await cloudinary.v2.uploader.upload(filebuffer.content);
      return { id: result.public_id, url: result.secure_url };
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("Image upload failed");
    }
  });

  const uploadimages = await Promise.all(imageUploadPromises);

  product.images = uploadimages;

  await product.save();

  res.status(200).json({ message: "Product images updated successfully" });

});
