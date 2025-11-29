import express from "express";
import cors from "cors";
import usersRouter from "./routes/user.routes";
import requestTypesRouter from "./routes/requestTypes.routes";
import requestsRouter from "./routes/requests.routes";
import historyRoutes from "./routes/history.routes";
import {initMongoIndexes} from "./mongo/client";

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

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ message: "Error interno del servidor" });
});

app.listen(PORT, async () => {
    console.log(`API escuchando en puerto ${PORT}`);
    try {
        await initMongoIndexes();
        console.log("MongoDB indexes inicializados");
    } catch (e) {
        console.error("Error inicializando índices de Mongo:", e);
    }
});
