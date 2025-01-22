import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { addAddress } from '../controllers/address.js';
import { fetchallddress } from '../controllers/address.js';
import { getsingleaddress } from '../controllers/address.js';
import { deleteaddress } from '../controllers/address.js';

const router = express.Router();

router.post('/address/new', isAuth,addAddress);
router.get('/address/all', isAuth,fetchallddress);
router.get('/address/:id', isAuth,getsingleaddress);
router.delete('/address/delete/:id', isAuth,deleteaddress);

export default router;