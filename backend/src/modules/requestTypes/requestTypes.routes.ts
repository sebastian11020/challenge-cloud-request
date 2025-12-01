import { Router } from "express";
import * as controller from "./requestTypes.controller";

const router = Router();

router.get("/", controller.listRequestTypes);
router.post("/", controller.createRequestTypeHandler);
router.patch("/:id", controller.updateRequestTypeHandler);

export default router;
