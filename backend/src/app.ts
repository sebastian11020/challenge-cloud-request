import express from "express";
import cors from "cors";

import usersRouter from "./modules/users/user.routes";
import requestTypesRouter from "./modules/requestTypes/requestTypes.routes";
import requestsRouter from "./modules/requests/requests.routes";
import historyRoutes from "./modules/history/history.routes";
import { initMongoIndexes } from "./db/mongo";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/users", usersRouter);
app.use("/api/requests", requestsRouter);
app.use("/api/request-types", requestTypesRouter);
app.use("/api/history", historyRoutes);


app.use(
    (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
        console.error(err);
        res.status(500).json({ message: "Error interno del servidor" });
    }
);

app.listen(PORT, async () => {
    console.log(`API escuchando en puerto ${PORT}`);
    try {
        await initMongoIndexes();
        console.log("MongoDB indexes inicializados");
    } catch (e) {
        console.error("Error inicializando índices de Mongo:", e);
    }
});

export default app;
