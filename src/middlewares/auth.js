import jwt from "jsonwebtoken"

export default(req, res, next) => {
    let token=req.headers['token']
    jwt.verify(token,"secret123",function(err,success){
        if (err){
            res.status(401).json({status:"Unauthorized"})
        }
        else{
            req.headers.roll=success['data']
            next()
        }
    })
}
