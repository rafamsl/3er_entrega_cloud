import { config } from "../../config/index.js";
import { OrdenesDao } from "../../dao/index.js";
import {
    DATE_UTILS,
  } from "../../utils/index.js";


  async function create_order(productos, usuario){
    const order = {
      productos : productos,
      usuario: usuario._id,
      timestamp: DATE_UTILS.getTimestamp()
    }
    
    const createdOrder = await OrdenesDao.save(order);
    return createdOrder.id
  }

  export const OrderController = {create_order}