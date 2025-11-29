import { Router } from "express";
import { prisma } from "../prisma/client";

const router = Router();

router.get("/", async (_req, res) => {
    try {
        const types = await prisma.requestType.findMany({
            orderBy: { name: "asc" },
        });
        res.json(types);
    } catch (error) {
        console.error("Error al obtener tipos de solicitud:", error);
        res.status(500).json({ message: "Error al obtener tipos de solicitud" });
    }
});

// POST /api/request-types  → crear nuevo tipo
router.post("/", async (req, res) => {
    try {
        const { code, name, description } = req.body as {
            code?: string;
            name?: string;
            description?: string;
        };

        if (!code || !name) {
            return res.status(400).json({
                message: "code y name son obligatorios",
            });
        }

        const type = await prisma.requestType.create({
            data: {
                code,
                name,
                description,
                active: true,
            },
        });

        res.status(201).json(type);
    } catch (error: any) {
        console.error("Error al crear tipo de solicitud:", error);
        res.status(500).json({ message: error?.message ?? "Error al crear tipo" });
    }
});

// PATCH /api/request-types/:id  → editar nombre/descripcion/activo
router.patch("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        const { name, description, active } = req.body as {
            name?: string;
            description?: string;
            active?: boolean;
        };

        const type = await prisma.requestType.update({
            where: { id },
            data: {
                name,
                description,
                active,
            },
        });

        res.json(type);
    } catch (error: any) {
        console.error("Error al actualizar tipo de solicitud:", error);
        res.status(500).json({ message: error?.message ?? "Error al actualizar tipo" });
    }
});

export default router;
