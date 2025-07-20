import { Router } from 'express'
import { registration, login, profileUpdate, profileDetails, verifyEmail, verifyOTP, passwordReset } from '../controllers/userControl.js'
import Authentication from '../middlewares/auth.js'
import {add, view, update, remove} from '../controllers/markControl.js'


const router=Router()

// User Reg & Login Routes

router.post('/registration', registration)
router.post('/login', login);

// User Profile Routes

router.post('/profileUpdate', Authentication , profileUpdate);
router.post('/profileDetails', Authentication , profileDetails);

// User Reset Password Routes

router.get('/verifyEmail/:email', verifyEmail);
router.get('/verifyOTP/:email/:otp', verifyOTP);
router.get('/passwordReset/:email/:otp/:password', passwordReset);

//Marks Routes

router.post('/add', Authentication , add)
router.post('/view', Authentication , view);
router.post('/update/:id', Authentication , update);
router.post('/remove/:id', Authentication , remove);

export default router