import { Router } from "express";
import { login, register, logout, profile, createAdministrator } from "../controllers/authController.js";
import { authRequired } from "../middlewares/validateToken.js";
import checkRole from "../middlewares/checkRole.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authRequired, profile);
router.post("/createAdministrator", checkRole(["administrator"]), createAdministrator);

export default router;