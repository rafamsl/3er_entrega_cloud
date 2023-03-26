import Router from "express"
import { UsuarioController } from "../../controllers/index.js"
import passport from "passport"

const router = Router()

router.post("/register", UsuarioController.save)
router.post("/login", passport.authenticate("login"),UsuarioController.postLogin)
router.post("/loginToken", UsuarioController.getLogin)
router.get("/loginGithub", passport.authenticate("github"), async (req,res) =>{
    const user = req.user
    res.send({success: true, message: `logged as ${user}`})
})
router.get("/github", passport.authenticate("github"), async(req,res) => {
    res.send("callback from github")
})
router.get("/logout", UsuarioController.getLogout)

export {router as AuthRouter} 
