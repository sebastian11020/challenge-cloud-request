import { Router } from "express";
import {
    getHistory,
    getHistoryByRequestId,
} from "../services/history.service";
import type { Request, Response, NextFunction } from "express";

const router = Router();
router.get(
    "/",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { actorId, action, from, to } = req.query;

            const filters: any = {};

            if (actorId !== undefined) {
                const parsed = Number(actorId);
                if (!Number.isNaN(parsed)) {
                    filters.actorId = parsed;
                }
            }

            if (action && typeof action === "string") {
                filters.action = action;
            }

            if (from || to) {
                if (from && typeof from === "string" && !Number.isNaN(Date.parse(from))) {
                    filters.from = new Date(from);
                }
                if (to && typeof to === "string" && !Number.isNaN(Date.parse(to))) {
                    filters.to = new Date(to);
                }
            }

            const events = await getHistory(filters);
            res.json(events);
        } catch (err) {
            next(err);
        }
    }
);

router.get(
    "/request/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const requestId = Number(req.params.id);

            if (Number.isNaN(requestId)) {
                return res.status(400).json({ message: "requestId inválido" });
            }

            const events = await getHistoryByRequestId(requestId);
            res.json(events);
        } catch (err) {
            next(err);
        }
    }
);

export default router;
