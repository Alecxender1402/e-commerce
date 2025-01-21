import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { createProduct, updateProduct, updateproductimages } from '../controllers/product.js';
import uploadfile from '../middlewares/multer.js';
import { getAllProducts } from '../controllers/product.js';
import { getsingleproduct } from '../controllers/product.js';

const router = express.Router();

router.post('/product/new',isAuth,uploadfile,createProduct);
router.get('/product/all',getAllProducts);
router.get('/product/:id',getsingleproduct);
router.put('/product/:id',isAuth,updateProduct);
router.post('/product/:id',isAuth,uploadfile,updateproductimages)
export default router;