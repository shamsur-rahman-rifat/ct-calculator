import jwt from "jsonwebtoken"
import userModel from "../models/user.js"
import sendEmail from '../utilities/sendEmail.js'
import OTPModel from "../models/Otp.js"

export async function registration(req,res){
    try {
        let reqBody=req.body 
        await userModel.create(reqBody)
        res.json({status:"Success",message:"Registration Completed"})
    } catch (error) {
        res.json({status:"Failed",message:error})
    }
}

export async function login(req,res){
    try {
        let reqBody=req.body 
        let user= await userModel.find(reqBody)
        if(user.length>0){
            let PayLoad={exp:Math.floor(Date.now()/1000)+(24*60*60),data:reqBody['roll']}
            let token=jwt.sign(PayLoad,"secret123")
            res.json({status:"Success",message:"User Found",token:token})
        }
    } catch (error) {
        res.json({status:"Failed",message:error})
    }
}

export async function profileUpdate(req,res){
    try {
        let roll=req.headers['roll']
        let reqBody=req.body
        await userModel.updateOne({roll:roll},reqBody)
        res.json({status:"Success",message:"Profile Updated"})
    } catch (error) {
        res.json({status:"Failed",message:error})
    }
}

export async function profileDetails(req,res){
    try {
        let roll=req.headers['roll']
        let result= await userModel.find({roll:roll})
        res.json({status:"Success",data:result})
    } catch (error) {
        res.json({status:"Failed",message:error})
    }
}

export async function verifyEmail(req,res){
    try {
        const {email}=req.params
        let user= await userModel.find({email:email})
        if (user.length>0){
            let otp= Math.floor(100000+Math.random()*900000)
            await sendEmail(email,"Your PIN is = " + otp,"CT Management Code")
            await OTPModel.create({email:email,otp:otp,status:"Active"})
            res.json({status:"Success",message:"OTP Send"})
        }
        else{
            res.json({status:"Failed",message:"No User Found"})
        }
    } catch (error) {
        res.json({status:"Failed",message:error})
    }
}

export async function verifyOTP(req,res){
    try {
        const {email,otp}= req.params
        let user= await OTPModel.find({email:email,otp:otp,status:"Active"})
        if (user.length>0){
            await OTPModel.updateOne({email:email,otp:otp,status:"Verified"})
            res.json({status:"Success",message:"Code Verified"})
        }
        else{
            res.json({status:"Failed",message:"Invalid Code"})
        }
    } catch (error) {
        res.json({status:"Failed",message:error})
    }
}

export async function passwordReset(req,res){
    try {
        const {email,otp,password}= req.params
        let user= await OTPModel.find({email:email,otp:otp,status:"Verified"})
        if (user.length>0){
            await OTPModel.deleteOne({email:email,otp:otp})
            await userModel.updateOne({email:email},{password:password})
            res.json({status:"Success",message:"Password Updated"})
        }
        else{
            res.json({status:"Failed",message:"Invalid Request"})
        }
    } catch (error) {
        res.json({status:"Failed",message:error})
    }
}