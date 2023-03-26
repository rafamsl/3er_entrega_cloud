import ContenedorMongo from "../../contenedores/contenedorMongo.js"
import { MessageModel } from "../../models/model_message.js"

class MessagesMongo extends ContenedorMongo {

    constructor() {
        super({
          name: MessageModel.MessageCollection,
          schema: MessageModel.MessageSchema,
        });
      }
    
    async getByCodigo(code){
      const response = await this.getOne({code : code})
      return response
    }
}


export {MessagesMongo}
