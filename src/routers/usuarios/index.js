import { Router } from "express";
import { UsuarioController } from "../../controllers/index.js";
import { verifyRole } from "../../middlewares/verifyRole.js";

const router = Router();

// /api/usuarios
router.get("", verifyRole, UsuarioController.getAll);

export { router as UsuarioRouter };