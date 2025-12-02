import type { Request, Response, NextFunction } from "express";
import {
    getHistory,
    getHistoryByRequestId,
    type HistoryFilters,
} from "./history.service";

function parseLocalDate(dateStr: string, endOfDay = false): Date | null {
    const parts = dateStr.split("-");
    if (parts.length !== 3) return null;

    const [yearStr, monthStr, dayStr] = parts;
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);

    if (
        Number.isNaN(year) ||
        Number.isNaN(month) ||
        Number.isNaN(day)
    ) {
        return null;
    }

    if (endOfDay) {
        return new Date(year, month - 1, day, 23, 59, 59, 999);
    }
    return new Date(year, month - 1, day, 0, 0, 0, 0);
}

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

        if (typeof from === "string") {
            const fromDate = parseLocalDate(from, false);
            if (fromDate) filters.from = fromDate;
        }

        if (typeof to === "string") {
            const toDate = parseLocalDate(to, true);
            if (toDate) filters.to = toDate;
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
