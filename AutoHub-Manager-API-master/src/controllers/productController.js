import multer from 'multer';
import Product from '../models/product.js';
import upload from '../middleware/multerConfig.js';

export const createProduct = async (req, res) => {
  try {
    console.log('Request received');

    upload.array('photo')(req, res, async (err) => {
      console.log('Inside upload.array callback');

      if (err instanceof multer.MulterError) {
        console.error('photo upload error:', err);
        return res.status(400).json({ error: 'photo upload error' });
      } else if (err) {
        console.error('Internal server error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      const { gearbox, price, tank, status, name, basicInfo,stock, region, color, moreDetails, } = req.body;
      const parsedStock = parseInt(stock, 10);
      if (isNaN(parsedStock)) {
        return res.status(400).json({ message: 'Invalid stock value' });
    }
      const photoPaths = req.files.map((file) => ({ path: file.filename }));

      console.log('Received form data:', {
        gearbox,
        name,
        price,
        tank,
        status,
        basicInfo,
        region,
        color,
        moreDetails,
        photo: photoPaths,
        stock ,  
      });
      console.log('Parsed Stock:', parsedStock);


      const newProduct = new Product({
        gearbox,
        name,
        price,
        tank,
        status,
        basicInfo,
        region,
        color,
        moreDetails,
        photo: photoPaths,  
        stock: parsedStock, 
      });

      console.log('Saving the product');

      const savedProduct = await newProduct.save();
      res.status(201).json({ message: "Product created successfully", product: savedProduct });
    });
  } catch (error) {
    console.error('Catch block error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to get a product by ID
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products }); 
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', product: deletedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const rateProductById = async (req, res) => {
  try {
      const productId = req.params.id;
      const { rating } = req.body;

      const product = await Product.findByIdAndUpdate(
          productId,
          { rating },
          { new: true }
      );

      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      res.json({ message: 'Product rating updated successfully', product });
  } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductCount = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    res.status(200).json({ totalProducts: productCount });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

