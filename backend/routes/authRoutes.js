import AuthController from "../controller/authController.js";
import express from 'express'
const router = express.Router()
const authController = new AuthController()

router.post('/signup',(req,res)=> authController.postSignup(req,res))
router.get('/user',(req,res)=>authController.checkUserExists(req,res))

router.post('/verify-otp', (req,res)=>authController.verifyOtp(req,res))

router.post('/login',(req, res)=>authController.postLogin(req,res))

router.post('/send-otp',(req,res)=>authController.sendOtp(req,res))

export default router