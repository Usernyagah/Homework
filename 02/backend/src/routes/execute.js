import { Router } from "express";
import { execute } from "../controllers/executeController.js";

const router = Router();

router.post("/", execute);

export default router;

