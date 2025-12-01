import { Router } from "express";
import * as controller from "./history.controller";

const router = Router();

router.get("/", controller.listHistory);
router.get("/request/:id", controller.listHistoryByRequest);

export default router;
