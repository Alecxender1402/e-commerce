import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { addItemToCart } from '../controllers/cart.js';
import { removefromCart } from '../controllers/cart.js';
import { updatecart } from '../controllers/cart.js';

const router = express.Router();

router.post('/cart/add',isAuth ,addItemToCart);
router.get('/cart/remove/:id',isAuth ,removefromCart);
router.post('/cart/update',isAuth ,updatecart);

export default router;