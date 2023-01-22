import jwt from "jsonwebtoken"
import { UsuariosDao } from "../dao/index.js"

async function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    // Check if authHeader exists and then get the Token part
    const token = authHeader && authHeader.split(" ")[1]
    if (token == null) return res.status(401).send("Missing User Token")
    let user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) =>{
        if (err) return res.status(403).send("User Token invalid")
        return user
    })
    if (user.email){
        user = await UsuariosDao.getOne({email:user.email})
        req.user = user
        next()
    }
}

export default authenticateToken