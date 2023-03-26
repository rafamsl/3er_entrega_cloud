import { config } from "../config/index.js"
import { CarritosFS, CarritosMemoria, CarritosMongo } from "./carritos/index.js"
import { ProductosFS, ProductosMemoria, ProductosMongo } from "./productos/index.js"
import { OrdenesMongo } from "./ordenes/index.js"
import { UsuariosMongo } from "./usuarios/index.js"
import { MongoDBService } from "../db/connections/mongoseconnection.js"
import { MessagesMongo } from "./messages/index.js"



const getSelectedDaos = () => {
  switch (config.DAO) {
    case "mongo": {
      MongoDBService.init();
      return {
        ProductosDao: new ProductosMongo(),
        CarritosDao: new CarritosMongo(),
        UsuariosDao: new UsuariosMongo(),
        OrdenesDao: new OrdenesMongo(),
        MessagesDao: new MessagesMongo()
      };
    }
    case "fs": {
      return {
        ProductosDao: new ProductosFS(
          config.DATABASES.filesystem.PRODUCTS_FILENAME
        ),
        CarritosDao: new CarritosFS(
          config.DATABASES.filesystem.CARTS_FILENAME
        ),
        OrdenesDao: new OrdenesMongo(),
        UsuariosDao: new UsuariosMongo(),
        MessagesDao: new MessagesMongo()
      };
    }
    case "memory": {
      return {
        ProductosDao: new ProductosMemoria(),
        CarritosDao: new CarritosMemoria(),
        OrdenesDao: new OrdenesMongo(),
        UsuariosDao: new UsuariosMongo(),
        MessagesDao: new MessagesMongo()
      };
    }
  }
};

const selectedDaos = getSelectedDaos()
const { ProductosDao, CarritosDao, UsuariosDao, OrdenesDao, MessagesDao } = selectedDaos;
export { ProductosDao, CarritosDao,UsuariosDao, OrdenesDao, MessagesDao }





