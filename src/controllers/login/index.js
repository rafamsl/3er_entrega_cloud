import { UsuariosDao, ProductosDao, CarritosDao } from "../../dao/index.js"
import { BCRYPT_UTILS, DATE_UTILS, ERRORS_UTILS, JOI_VALIDATOR, LOGGER_UTILS, MESSAGE_UTILS } from "../../utils/index.js"
import { ProductController } from "../productos/index.js"; 
import {config} from "../../config/index.js"
import { CarritoController } from "../carritos/index.js";
import Chat from "twilio/lib/rest/Chat.js";


async function getAllProducts(){
  try {
    LOGGER_UTILS.info_log("no_path", "getAllProducts")
    const product = await ProductosDao.getAll();
    return product
  } catch (error) {
    return error;
  }
}


async function viewLogin(req,res){
  LOGGER_UTILS.info_log(req.originalUrl, "viewLogin")
  res.render('login')
}
async function viewRegister(req,res){
  LOGGER_UTILS.info_log(req.originalUrl, "viewRegister")
  res.render('register')
}
async function home(req,res){
  LOGGER_UTILS.info_log(req.originalUrl, "home")
  const products = await getAllProducts()
  const carrito = await CarritosDao.getById(req.user.carrito);
  const producto_carritos = await CarritoController.getCartProducts(carrito)
  const object = { 
    user: req.user.email, 
    telefono: req.user.telefono, 
    carrito_id: carrito.id, 
    carrito_productos: producto_carritos, 
    direccion: req.user.direccion, 
    nacimiento: DATE_UTILS.formatTimestamp(req.user.nacimiento), 
    products: products, 
    server:process.pid, 
    port:config.SERVER.PORT }
  res.render("home",object);
}

async function info(req,res){
  LOGGER_UTILS.info_log(req.originalUrl, "info")
  res.send(config.PROCESS)
}
async function view_new_product(req,res){
  LOGGER_UTILS.info_log(req.originalUrl, "view_new_product")
  res.render("new-product")
}

async function view_product(req,res){
  LOGGER_UTILS.info_log(req.originalUrl, "view_product") 
  const productId = req.params.productId
  const product = await ProductosDao.getById(productId)
  res.render('view-product', {"product" : product})
}

async function add_to_cart(req,res){
  LOGGER_UTILS.info_log(req.originalUrl, "add_to_cart")
  const productId = req.params.productId
  req.body = {"productId" : productId, "stockRequest" : 1}
  await CarritoController.addToCart(req,res)
}
async function remove_from_cart(req,res){
  LOGGER_UTILS.info_log(req.originalUrl, "remove_from_cart")
  await CarritoController.removeFromCart(req,res)
}
async function buy(req,res){
  LOGGER_UTILS.info_log(req.originalUrl, "remove_from_cart")
  await CarritoController.buy(req,res)
}
async function new_product(req,res){
  try {
    LOGGER_UTILS.info_log(req.originalUrl, "new_product")
    await ProductController.save(req,res)  
  } catch (error) {
    LOGGER_UTILS.error_log(req.originalUrl, "new_product", error)
    res.send({error:error})
  }
}

async function chat(req,res){
  LOGGER_UTILS.info_log(req.originalUrl, "chat")
  res.render("chat")
}
async function chat_email(req,res){
  LOGGER_UTILS.info_log(req.originalUrl, "chat_email")
  res.render("chat-email")
}

async function logout(req, res) {
  LOGGER_UTILS.info_log(req.originalUrl, "logout")
  req.logout(() => {res.redirect("/login")})
}
async function failureLogin(req,res){
  const error = req.flash("error")[0];
  LOGGER_UTILS.warn_log(req.originalUrl, "failureRegister", "User Login Error")
  res.render("login-error", {error : error});
}
async function failureRegister(req,res){
  const error = req.flash("error")[0];
  LOGGER_UTILS.warn_log(req.originalUrl, "failureRegister", "User Registration Error")
  res.render("register-error", {error : error});
}

async function register(req,res){
  LOGGER_UTILS.info_log(req.originalUrl, "register")
  try { 
    const {email, password, direccion, telefono, nacimiento } = req.body;
    let user = await UsuariosDao.getOne({email:email})

    if (!user){
      user = await JOI_VALIDATOR.user.validateAsync({
      email,
      password,
      direccion,
      telefono,
      nacimiento : nacimiento,
      timestamp: DATE_UTILS.getTimestamp(),
      })
      user.password = BCRYPT_UTILS.createHash(user.password)
      // create carrito
      const carrito_id = await CarritoController.create_carrito()
      user.carrito = carrito_id
      await UsuariosDao.save(user);
      res.render("login", {message : "User created"})
    } else{
      res.send({ error: ERRORS_UTILS.MESSAGES.EXISTING_USER})
    }    
    //enviar email al admin
    const filteredUser = Object.fromEntries(Object.entries(user).filter(([key]) => key !== "password"));
    filteredUser.nacimiento = DATE_UTILS.formatTimestamp(filteredUser.nacimiento)
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
    LOGGER_UTILS.error_log(req.originalUrl, "register", error)
    res.send(`Sorry we had an error => ${error.message}`);
  }
}


export const LoginController = {viewLogin, viewRegister, home, logout, failureLogin, failureRegister, register, view_new_product, new_product, info, view_product,add_to_cart,remove_from_cart, buy, chat, chat_email}