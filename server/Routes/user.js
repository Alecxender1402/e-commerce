import express from 'express';
import {loginuser, myprofile} from '../controllers/user.js';
import {verifyUser} from '../controllers/user.js';
import isAuth from '../middlewares/isAuth.js';

const router = express.Router();

router.post('/user/login',loginuser);
router.post('/user/verify',verifyUser);
router.get('/user/me',isAuth,myprofile);

export default router;