import { Router } from "express";
import { login, register, logout, profile, createAdministrator, verificarToken } from "../controllers/authController.js";
import { authRequired } from "../middlewares/validateToken.js";
import validarRol from "../middlewares/checkRole.js";
import { validarSchema } from "../middlewares/validatorMiddleware.js";
import { registerSchema, loginSchema } from "../schemas/authSchema.js";

const router = Router();

router.post("/register", validarSchema(registerSchema), register);
router.post("/login", validarSchema(loginSchema), login);
router.post("/logout", logout);
router.get("/verify", verificarToken);
router.get("/profile", authRequired, profile);
router.post("/createAdministrator", validarRol(["administrator"]), createAdministrator);

export default router;