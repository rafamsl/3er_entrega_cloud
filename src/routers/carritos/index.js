import { Router } from "express";
import {CarritoController} from "../../controllers/index.js"
import authenticateToken from "../../middlewares/authenticateToken.js";
import { verifyRole } from "../../middlewares/verifyRole.js";

const router = Router();

// /api/carritos
router.get("/",verifyRole , CarritoController.getAll);

router.get("/usercart", authenticateToken, CarritoController.getUserCart)

router.get("/:id",verifyRole , CarritoController.getById);

router.post("/",authenticateToken, CarritoController.save);

router.post("/usercart/productos",authenticateToken, CarritoController.addToCart);

router.post("/usercart/buy",authenticateToken, CarritoController.buy);

router.delete("/usercart",authenticateToken, CarritoController.deleteCart);

router.delete("/usercart/productos/:productId",authenticateToken, CarritoController.removeFromCart)

export { router as CarritoRouter };