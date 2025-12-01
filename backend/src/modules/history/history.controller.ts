import type { Request, Response, NextFunction } from "express";
import {
    getHistory,
    getHistoryByRequestId,
    type HistoryFilters,
} from "./history.service";

export const listHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { actorId, action, from, to } = req.query;

        const filters: HistoryFilters = {};

        if (actorId !== undefined) {
            const parsed = Number(actorId);
            if (!Number.isNaN(parsed)) {
                filters.actorId = parsed;
            }
        }

        if (action && typeof action === "string") {
            filters.action = action as HistoryFilters["action"];
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
        return res.json(events);
    } catch (err) {
        return next(err);
    }
};

export const listHistoryByRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const requestId = Number(req.params.id);

        if (Number.isNaN(requestId)) {
            return res.status(400).json({ message: "requestId inválido" });
        }

        const events = await getHistoryByRequestId(requestId);
        return res.json(events);
    } catch (err) {
        return next(err);
    }
};
