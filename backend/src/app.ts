import express from "express";
import cors from "cors";
import usersRouter from "./routes/user.routes";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/users", usersRouter);

app.listen(PORT, () => {
    console.log(`Backend escuchando en http://localhost:${PORT}`);
});
