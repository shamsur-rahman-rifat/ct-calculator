import markModel from "../models/Mark.js"

export async function add(req,res){
    try {
        let reqBody=req.body 
        let roll=req.headers['roll']
        reqBody.roll=roll
        await markModel.create(reqBody)
        res.json({status:"Success",message:"Mark Added"})
    } catch (error) {
        res.json({status:"Failed",message:error})
    }
}

export async function view(req,res){
    try {
        let roll=req.headers['roll']
        let result= await markModel.find({roll:roll})
        res.json({status:"Success",data:result})
    } catch (error) {
        res.json({status:"Failed",message:error})
    }
}

export async function update(req,res){
    try {
        let reqBody=req.body 
        let {id}=req.params
        let roll=req.headers['roll']
        reqBody.roll=roll
        await markModel.updateOne({_id:id,roll:roll},reqBody)
        res.json({status:"Success",message:"Mark Updated"})
    } catch (error) {
        res.json({status:"Failed",message:error})
    }
}

export async function remove(req,res){
    try {
        let {id}=req.params
        let roll=req.headers['roll']
        await markModel.deleteOne({_id:id,roll:roll})
        res.json({status:"Success",message:"Removed"})
    } catch (error) {
        res.json({status:"Failed",message:error})
    }
}