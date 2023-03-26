import ContenedorMongo from "../../contenedores/contenedorMongo.js"
import { OrderModel } from "../../models/model_order.js"

class OrdenesMongo extends ContenedorMongo {

    constructor() {
        super({
          name: OrderModel.OrderCollection,
          schema: OrderModel.OrderSchema
        });
      }
    
    async getById(id) {
        const response = await this.model.findById(id).populate("productos").populate("usuarios");
    
        return response;
    }
}


export {OrdenesMongo}
