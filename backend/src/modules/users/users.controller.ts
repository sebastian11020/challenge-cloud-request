import type { Request, Response, NextFunction } from "express";
import { getAllUsers } from "./users.service";

export const listUsers = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await getAllUsers();
        return res.json(users);
    } catch (err) {
        console.error("Error al obtener usuarios:", err);
        return next(err);
    }
};
