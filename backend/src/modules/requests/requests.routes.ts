import { Router } from "express";
import * as controller from "./requests.controller";

const router = Router();

router.get("/", controller.listRequests);
router.get("/stats", controller.getStats);
router.post("/", controller.create);
router.get("/:identifier", controller.getByIdentifier);
router.post("/:id/approve", controller.approve);
router.post("/:id/reject", controller.reject);

export default router;