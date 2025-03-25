import Cart from '../models/cart.js';
import Product from '../models/product.js'; // Import Product model

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    console.log(`Initial stock: ${product.stock}, Requested quantity: ${quantity}`);

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Reduce stock and save
    product.stock -= quantity;
    await product.save(); // Ensure save happens

    // Fetch updated product to ensure correct stock value
    const updatedProduct = await Product.findById(productId);
    console.log(`Updated stock after reduction: ${updatedProduct.stock}`);

    // Add the item to the cart
    const cartItem = new Cart({
      productId,
      quantity,
      user: req.user._id
    });

    await cartItem.save();

    // Ensure the response contains the updated stock
    res.status(201).json({
      message: 'Product added to cart successfully',
      updatedStock: updatedProduct.stock
    });

  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




export const getCartForUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const cartItems = await Cart.find({ user: userId, paymentStatus: { $in: ['PENDING', 'PAID'] } }).populate('productId');
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getAllCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.find().populate('productId').populate({ path: 'user', select: 'email' });
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const deleteProductItemById = async (req, res) => {
  try {
    const cartItemId = req.params.id;

    console.log(`Attempting to remove cart item: ${cartItemId}`);

    // Find the cart item before deleting to retrieve the productId and quantity
    const deletedCartItem = await Cart.findById(cartItemId);
    if (!deletedCartItem) {
      console.log("Cart item not found.");
      return res.status(404).json({ message: "Cart item not found" });
    }

    const productId = deletedCartItem.productId;
    const quantityToRestore = deletedCartItem.quantity;

    console.log(`Cart item found. Product ID: ${productId}, Quantity to restore: ${quantityToRestore}`);

    // Remove the item from the cart
    await Cart.findByIdAndDelete(cartItemId);
    console.log("Cart item deleted successfully.");

    // Find and update the product stock
    const product = await Product.findById(productId);
    if (!product) {
      console.log("Product not found in database.");
      return res.status(404).json({ message: "Product not found in database" });
    }

    console.log(`Previous Stock: ${product.stock}, Restoring: ${quantityToRestore}`);

    // Update stock by adding the quantity that was removed from the cart
    product.stock += quantityToRestore;

    // Save the updated product with the restored stock
    await product.save();

    // Fetch updated product from database to confirm stock update
    const updatedProduct = await Product.findById(productId);
    console.log(`Updated Stock: ${updatedProduct.stock}`);

    res.json({
      message: "Product removed from cart and stock updated",
      updatedStock: updatedProduct.stock,
    });
  } catch (error) {
    console.error("Error in deleteProductItemById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProductStock = async (req, res) => {
  try {
    const { productId, quantityToRestore } = req.body;

    // Find the product in the database
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Restore stock
    product.stock += quantityToRestore;

    // Save the updated stock count
    await product.save();

    res.status(200).json({ message: 'Stock updated successfully', updatedStock: product.stock });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ error: 'Failed to update stock' });
  }
};


  export const clearCartForUser = async (req, res) => {
    try {
      const userId = req.user._id;
      await Cart.updateMany({ user: userId, paymentStatus: 'PENDING' }, { paymentStatus: 'PAID' });
      res.status(200).json({ message: 'Cart marked as paid successfully' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const updateOrderStatus = async (req, res) => {
    try {
      const { cartItemId, orderStatus } = req.body;
      const updatedCartItem = await Cart.findByIdAndUpdate(
        cartItemId,
        { orderStatus },
        { new: true }
      );

      if (!updatedCartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }

      res.status(200).json({ message: 'Order status updated successfully', cartItem: updatedCartItem });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const getOrderStatus = async (req, res) => {
    try {
      const { cartItemId } = req.params;
      const cartItem = await Cart.findById(cartItemId).populate('productId');

      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }

      res.status(200).json({ orderStatus: cartItem.orderStatus, cartItem });
    } catch (error) {
      console.error('Error fetching order status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
 
  // Fetch cart items based on order status
  export const getProductsByOrderStatus = async (req, res) => {
    try {
      const { status } = req.query; // Retrieve status from query parameters (e.g., 'PROCESSING', 'DELIVERED', 'SHIPPED')
  
      if (!status) {
        return res.status(400).json({ message: "Order status is required" });
      }
  
      // Find products with the given order status
      const cartItems = await Cart.find({ orderStatus: status })
        .populate('productId')  // Assuming the productId references a 'Product' model
        .populate('user')       // Assuming user references the 'CLIENT' model
        .exec();
  
      if (!cartItems || cartItems.length === 0) {
        return res.status(404).json({ message: `No products found for order status: ${status}` });
      }
  
      return res.status(200).json(cartItems);
    } catch (error) {
      console.error("Error fetching cart items by order status:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  

  export const bookAppointment = async (req, res) => {
    try {
      const { productId, date, location, phoneNumber } = req.body;
      const user = req.user._id;

      const appointment = new Cart({
        productId,
        user,
        date,
        location,
        phoneNumber
      });

      await appointment.save();

      res.status(201).json({ message: 'Appointment booked successfully', appointment });
    } catch (error) {
      console.error('Error booking appointment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  export const getAllAppointmentsForUser = async (req, res) => {
    try {
      const appointments = await Cart.find()
        .populate('productId')
        .populate({ path: 'user', select: 'email names' });
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const countAllCartProducts = async (req, res) => {
    try {
      const totalQuantity = await Cart.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$quantity" }
          }
        }
      ]);

      res.status(200).json({ totalQuantity: totalQuantity[0] ? totalQuantity[0].total : 0 });
    } catch (error) {
      console.error('Error counting cart products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const getTopSellingProduct = async (req, res) => {
    try {
      const topProduct = await Cart.aggregate([
        {
          $group: {
            _id: "$productId",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 1
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productDetails"
          }
        },
        {
          $unwind: "$productDetails"
        },
        {
          $project: {
            _id: 0,
            productId: "$_id",
            count: 1,
            productDetails: 1
          }
        }
      ]);

      if (!topProduct || topProduct.length === 0) {
        return res.status(404).json({ message: 'No top selling product found' });
      }

      res.status(200).json(topProduct[0]);
    } catch (error) {
      console.error('Error fetching top selling product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const getTotalStock = async (req, res) => {
    try {
      const totalStock = await Product.aggregate([
        { $group: { _id: null, totalProducts: { $sum: "$stock" } } }
      ]);

      res.status(200).json({ totalStock: totalStock[0]?.totalProducts || 0 });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };