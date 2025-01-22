import trycatch from '../utils/trycatch.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';

export const addItemToCart = trycatch(async (req, res) => {
    const { product } = req.body;

    const cart = await Cart.findOne({ product, user: req.user._id }).populate('product');

    if(cart) {
       if(cart.product.stock === cart.quantity) {
           return res.status(400).json({ message: 'Product is out of stock' });
       }

        cart.quantity += 1;

        await cart.save();

        return res.status(201).json({ message: 'Product added to cart successfully' });
    }

    const cartproduct = await Product.findById(product);

    if(cartproduct.stock === 0) {
        return res.status(400).json({ message: 'Product is out of stock' });
    }

    await Cart.create({ product, user: req.user._id, quantity: 1 });

    res.status(201).json({ message: 'Product added to cart successfully' });
});

export const removefromCart = trycatch(async (req, res) => {
   const cart = await Cart.findById(req.params.id);

   await cart.deleteOne();

    res.status(200).json({ message: 'Product removed from cart successfully' });
});  

export const updatecart = trycatch(async (req, res) => {
    const {action} = req.body;

    if(action === 'increment') {
        const {id} = req.body;
        const cart = await Cart.findById(id).populate('product');

        if(cart.product.stock === cart.quantity) {
            return res.status(400).json({ message: 'Product is out of stock' });
        }

        cart.quantity += 1;

        await cart.save();

        return res.status(200).json({ message: 'Cart updated successfully' });
    }

    if(action === 'decrement') {
        const {id} = req.body;
        const cart = await Cart.findById(id).populate('product');

        if(cart.quantity > 1) {

            cart.quantity -= 1;

            await cart.save();
        }
        else{
            res.status(400).json({ message: 'Quantity cannot be less than 1' });
        } 

        return res.status(200).json({ message: 'Cart updated successfully' });
    }


});