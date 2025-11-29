import { Router } from "express";
import { getAllUsers } from "../services/users.service";

const router = Router();

router.get("/", async (_req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
});

export default router;
