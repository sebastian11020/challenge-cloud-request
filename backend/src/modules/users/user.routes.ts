import { Router } from "express";
import * as controller from "./users.controller";

const router = Router();

router.get("/", controller.listUsers);

export default router;
