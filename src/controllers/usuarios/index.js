import { UsuariosDao, CarritosDao } from "../../dao/index.js";
import {
  DATE_UTILS,
  ERRORS_UTILS,
  JOI_VALIDATOR,
  LOGGER_UTILS,
  BCRYPT_UTILS,
  MESSAGE_UTILS
} from "../../utils/index.js";
import { CarritoController } from "../carritos/index.js";
import jwt from "jsonwebtoken"
import { config } from "../../config/index.js";


async function getAuth(req, res){
  try {
      const {email, password} = req.body
      if (!email || !password){
          return "Missing Email or Password"
      }
      
      const userId = await UsuariosDao.getOne({ email: email });
      if (!userId) {
          return "User not found"
      }

      const user = await UsuariosDao.getById(userId);
      if (!user) {
          return "User not found"
      }

      if (!BCRYPT_UTILS.validatePassword(user, password)) {
          return "Invalid password"
      }

      return {success:true, user:user}

  } catch (error) {
      console.log(error)
      return error
  }
}

async function getAll(req,res){
    try {
        const users = await UsuariosDao.getAll();
        if (!users || !users[0]) {
          return res.send({ error: ERRORS_UTILS.MESSAGES.NO_DATA});
        }
    
        res.send(users);
      } catch (error) {
        res.send({ error});
      }
}

async function postLogin(req,res){
  const user = req.user
  res.send({succes:true, user: user})
}

async function createAccessToken(user){
  const accessToken = jwt.sign({email:user.email, id:user._id, password:user.password}, process.env.ACCESS_TOKEN_SECRET)
  return accessToken
}

async function getLogin(req,res){
  const authMessage = await getAuth(req,res)
  if (authMessage.success){
    const user = authMessage.user
    const accessToken = await createAccessToken(user)
    res.send({user:user, accessToken:accessToken})
  } else {
    res.send(authMessage)
  }
  // if (req.user){
  //   const user = req.user
  //   const email = user.email
  //   const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET)
  //   res.send(`logged as ${email} | token = ${accessToken}`)
  // } else {
  //   res.send("not logged in")
  // }
}

async function getById(req,res){
    try{
        const { id } = req.params;

        const user = await UsuariosDao.getById(id);
        if (!user) {
            return res.send({ error: ERRORS_UTILS.MESSAGES.NO_USER});
        }
        res.send(user);
    } catch(error) {
        res.send({ error});
    }
}

async function save(req,res){
    try {
        const {email, password,telefono,nacimiento,direccion } = req.body;

        let user = await UsuariosDao.getOne({email:email})
    
        if (!user){
          user = await JOI_VALIDATOR.user.validateAsync({
            email,
            password,
            telefono,
            nacimiento,
            direccion,
            timestamp: DATE_UTILS.getTimestamp(),
          })
          user.password = BCRYPT_UTILS.createHash(user.password)
          user.nacimiento = nacimiento
          // create carrito
          const carrito_id = await CarritoController.create_carrito()
          user.carrito = carrito_id
          // save user
          const createdUser = await UsuariosDao.save(user);
          const accessToken = await createAccessToken(user)
          res.send({user:createdUser, accessToken:accessToken});
        } else{
          res.send({ error: ERRORS_UTILS.MESSAGES.EXISTING_USER})
        }    
        //enviar email al admin
        const filteredUser = Object.fromEntries(Object.entries(user).filter(([key]) => key !== "password"));
        filteredUser.date = DATE_UTILS.formatTimestamp(filteredUser.date)
        const registerMail = {
          subject: 'Nuevo registro',
          body: JSON.stringify(filteredUser)
        }
        try {
          console.log("Sending email")
          const emailResponse = await MESSAGE_UTILS.sendMail(registerMail.subject, registerMail.body, config.CREDENTIALS.adminMail)  
          await LOGGER_UTILS.info_log("Register User",`Send Email Successfull: ${emailResponse}`)
        } catch (error) {
          await LOGGER_UTILS.error_log("Register User","Send email",error);
        }

      } catch (error) {
        await LOGGER_UTILS.error_log("Register User","Save",error);
        res.send(error);
      }
}

async function addCartToUser(req, cartId){
  const user = await UsuariosDao.getById(req.user._id)
  user.carrito = cartId
  await UsuariosDao.update(user._id, user)

}


async function deleteById(req,res){
    try {
        const { id } = req.params;
        const user = await UsuariosDao.getById(id)
        if (!user){
          res.send({ error: ERRORS_UTILS.MESSAGES.NO_USER})
        }
        await UsuariosDao.deleteById(id);
        res.send({ success: true });
      } catch (error) {
        console.error(error);
        res.send({ error: "Ocurrio un error" });
      }
}

async function editById(req,res){
    try {
        const { id } = req.params;
        const { email, password } = req.body;
        let user = await UsuariosDao.getOne({email:email})
    
        if (!user){
            user = await JOI_VALIDATOR.user.validateAsync({
            email,
            password,
            timestamp: DATE_UTILS.getTimestamp(),
          });
          const updatedUser = await UsuariosDao.update(id, user);
          res.send(updatedUser)
        }
      } catch (error) {
        console.error(error);
        res.send({ error: "Ocurrio un error" });
      }
}

async function getLogout(req,res){
  req.logout(() => {res.send("User logged out")})
  
}

export const UsuarioController = {getAll, getById,editById,save,deleteById, addCartToUser, getLogout,postLogin,getLogin} 