import express from "express";
import cors from "cors";
import usersRouter from "./routes/user.routes";
import requestTypesRouter from "./routes/requestTypes.routes";
import requestsRouter from "./routes/requests.routes";

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

app.listen(PORT, () => {
    console.log(`Backend escuchando en http://localhost:${PORT}`);
});
