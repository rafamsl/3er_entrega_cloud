import { config } from "../../config/index.js";
import { CarritosDao, ProductosDao, UsuariosDao } from "../../dao/index.js";
import {
  DATE_UTILS,
  ERRORS_UTILS,
  LOGGER_UTILS,
  MESSAGE_UTILS,
} from "../../utils/index.js";
import { OrderController } from "../ordenes/index.js";
import { UsuarioController } from "../usuarios/index.js";

async function getAll(req,res){
    try {
        const carrito = await CarritosDao.getAll();
    
        if (!carrito || !carrito[0]) {
          return res.send({ error: ERRORS_UTILS.MESSAGES.NO_DATA});
        }
    
        res.send(carrito);
      } catch (error) {
        LOGGER_UTILS.error_log("Cart","GetAll",error)
        res.send({ error: "Internal server error" });
      }
}

async function getById(req,res){
    try{
        const { id } = req.params;
        const carrito = await CarritosDao.getById(id);
        if (!carrito) {
            return res.send({ error: ERRORS_UTILS.MESSAGES.NO_CART});
        }
        res.send(carrito);
    } catch(error) {
        LOGGER_UTILS.error_log("Cart","GetById",error)
        return res.send({error:"Internal server error"}) 
    }
}

async function getUserCart(req,res){
  try{
    const user = req.user
    if(user.carrito){
      const carrito = await CarritosDao.getById(user.carrito._id);
      return res.send({carrito})
    } else{
      res.send(ERRORS_UTILS.MESSAGES.NO_CART)
    }
  } catch(error){
    LOGGER_UTILS.error_log("UserCart","GetUserCart",error)
    res.send({error:"Internal server error"})
  }
}

async function create_carrito(){
  const carrito = {
    productos : [],
    timestamp: DATE_UTILS.getTimestamp()
  }
  
  const createdCarrito = await CarritosDao.save(carrito);
  const id = createdCarrito.id
  return id
}
async function save(req,res){
    try {
        const id = await create_carrito()
        UsuarioController.addCartToUser(req,id)
        res.json({id})
    
      } catch (error) {
        LOGGER_UTILS.error_log("Cart","save",error)
        res.send(error);
      }
}

async function getCartProducts(cart){
  const products = []
  const cart_products = cart.productos
  for (const product_object of cart_products){
    const producto = await ProductosDao.getById(product_object.product_id)
    producto.stock = product_object.stock
    products.push(producto)
  }
  return products
}

async function addToCart(req,res){
    const { productId, stockRequest } = req.body;
    const user = await UsuariosDao.getById(req.user._id)
    const cart = await CarritosDao.getById(user.carrito);
    // Chequear que hay carrito
    if (!cart){
      return res.send({ error: true, message: ERRORS_UTILS.MESSAGES.NO_CART });
    }
    const product = await ProductosDao.getById(productId)
    // Chequear que hay producto
    if (!product){
      return res.send({ error: true, message: ERRORS_UTILS.MESSAGES.NO_PRODUCT });
    }
    const originalStock = product.stock 
    // Chequear que hay stock
    if (product.stock < stockRequest)
      return res.send({ error: true, message: ERRORS_UTILS.MESSAGES.NO_STOCK + " " + product.stock});
    // Actualizar carrito
    cart.productos.push({product_id:product._id, stock:stockRequest});
    const updatedCart = await CarritosDao.update(cart.id, cart);
    res.send({ success: true, cart: updatedCart });
    // Actualizar stock del producto despues de responder al cliente
    product.stock = originalStock - stockRequest
    await ProductosDao.update(productId,product)
}

async function deleteCart(req,res){
    try {
        const user = await UsuariosDao.getById(req.user._id)
        const carrito = await CarritosDao.getById(user.carrito);
        if (!carrito){
          return res.send({ error: ERRORS_UTILS.MESSAGES.NO_CART})
        }
        
        // Devolver stock de cada producto
        const productos = carrito.productos
        if (!productos){
          return
        }
        for (const producto of productos) {
          const stockProduct = await ProductosDao.getById(producto.product_id)
          stockProduct.stock += producto.stock
          await ProductosDao.update(producto.id, stockProduct)
        }
        console.log("stock actualizado")

        // Borrar carrito
        await CarritosDao.deleteById(carrito.id);

        // Actualizar usuario 
        const newCartId = await create_carrito()
        UsuarioController.addCartToUser(req,newCartId)

        res.send({ success: true });

      } catch (error) {
        console.error(error);
        res.send({ error: "Ocurrio un error" });
      }
}

async function deleteById(id){
  try {
    const carrito = await CarritosDao.getById(id)
    if (!carrito){
      return res.send({ error: ERRORS_UTILS.MESSAGES.NO_CART})
    }
    // Borrar carrito
    await CarritosDao.deleteById(id);

    // Devolver stock de cada producto
    const productos = carrito.productos
    if (!productos){
      return
    }
    for (const producto of productos) {
      const stockProduct = await ProductosDao.getById(producto.id)
      stockProduct.stock += producto.stock
      await ProductosDao.update(producto.id, stockProduct)
    }
    console.log("stock actualizado")

  } catch (error) {
    await LOGGER_UTILS.error_log(error);
  }
}

async function removeFromCart (req,res) {
  const { productId } = req.params;
  const user = await UsuariosDao.getById(req.user._id)
  const carrito = await CarritosDao.getById(user.carrito)

  // chequear que hay carrito
  if (!carrito){
    return res.send({ error: ERRORS_UTILS.MESSAGES.NO_CART})
  }
  
  // Chequear que hay producto
  if (!carrito.productos[0]){
    return res.send({ error: ERRORS_UTILS.MESSAGES.NO_PRODUCT})
  }
  const productoIndex = carrito.productos.findIndex(obj => obj.id == productId);
  let removedProduct = carrito.productos[productoIndex]
  if (productoIndex === -1){
    const prod_codigo = ProductosDao.getById(productId).codigo
    const productoIndex2 = carrito.productos.findIndex(obj => obj.codigo == prod_codigo)
    removedProduct = carrito.productos[productoIndex2]
    if (productoIndex2 === -1){
      return res.send({ error: true, message: ERRORS_UTILS.MESSAGES.NO_PRODUCT });
    };
  }  

  // Actualizar carrito
  carrito.productos.splice(productoIndex,1)
  await CarritosDao.update(carrito.id,carrito)
  res.send({ success: true })

  // Actualizar stock
  const stockProduct = await ProductosDao.getById(productId)
  stockProduct.stock += removedProduct.stock
  await ProductosDao.update(productId, stockProduct)
}

async function buy(req,res){

  //borrar carrito
  const user = await UsuariosDao.getById(req.user._id)
  const carrito = await CarritosDao.getById(user.carrito);
  await CarritosDao.deleteById(carrito.id);

  // Crear orden
  await OrderController.create_order(carrito.productos, user)

  // Actualizar usuario 
  const newCartId = await create_carrito()
  UsuarioController.addCartToUser(req,newCartId)
  res.send({succes:true})

  

  // enviar mensaje al user
  const smsBuy = {
    message: `Tu pedido fue registrado con éxito`
  }
  try {
    const smsResponse = await MESSAGE_UTILS.sendSMS(smsBuy.message, user.telefono)
    await LOGGER_UTILS.info_log("Purchase",`Send sms Purchase Successfull: ${carrito._id}`)
  } catch (error) {
    await LOGGER_UTILS.error_log("Purchase",`Send sms: ${carrito._id} to ${smsResponse}`, error) 
  }
  // enviar mensaje al admin
  const mailBuy = {
    subject: 'Nuevo pedido',
    body: `Nuevo pedido de ${user.email}: ${carrito}`
  }
  try {
    const emailResponse = await MESSAGE_UTILS.sendMail(mailBuy.subject,mailBuy.body,config.CREDENTIALS.adminMail)
    await LOGGER_UTILS.info_log("Purchase",`Send email Purchase Successfull: ${carrito._id} to ${emailResponse}`)
  } catch (error) {
    await LOGGER_UTILS.error_log("Purchase",`Send email: ${carrito._id} to ${emailResponse}`, error)
  }
}

export const CarritoController = {getAll,getById,save,deleteCart,removeFromCart, addToCart, deleteById, getUserCart, getCartProducts, create_carrito, buy}