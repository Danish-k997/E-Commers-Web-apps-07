import productModel from "../module/Productsmodule.js";
import cloudinary from "../Config/cloudinary.js";
import fs from "fs";
import { log } from "console";


// GET
export const getProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADD
export const addProduct = async (req, res) => {
  try {
    
    const { name, price, description, category, size, bestseller } = req.body;

   const imageUrls = [];

   
   
   for (let file of req.files) {
     const result = await cloudinary.uploader.upload(file.path);
     imageUrls.push(result.secure_url);
    }  
    

    const product = new productModel({
      name,
      price,
      description,
      category,
      size,
      bestseller: bestseller === "true",
      images: imageUrls, 
    });

    await product.save();

    for (let file of req.files) {
  fs.unlinkSync(file.path);
}

    res.json({ success: true, product });

  } catch (error) {
    console.log("REAL ERROR:", error); 
    res.status(500).json({ error: error.message });
  }
};

// DELETE
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};  


export const UpdateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, size, description, bestseller } = req.body;

    
    let imageUrls = [];
       
    
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        imageUrls.push(result.secure_url);

        fs.unlinkSync(file.path);
      }
    }

    const updatedData = {
      name,
      price,
      category,
      size,
      description,
      bestseller: bestseller === "true",
    };

    // agar new image hai tabhi update karo
    if (imageUrls.length > 0) {
      updatedData.images = imageUrls;
    }

    const product = await productModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


 export const bestSellerProducts = async (req, res) => {
  try {
    const bestSellerProducts = await productModel.find({bestseller:true})
    res.status(200).json({success:true,message:"Best seller products fetched successfully",data:bestSellerProducts})
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
} 

