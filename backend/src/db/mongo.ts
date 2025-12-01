import { MongoClient, Db, Collection } from "mongodb";

let mongo: MongoClient | null = null;
let db: Db | null = null;

export type RequestHistoryAction = "CREATED" | "STATUS_CHANGED";

export type RequestHistoryRole =
    | "SOLICITANTE"
    | "RESPONSABLE"
    | "APROBADOR"
    | "ADMIN";

export interface RequestHistoryEvent {
    requestId: number;
    action: RequestHistoryAction;
    previousStatus: string | null;
    newStatus: string;
    actorId: number;
    actor: string;
    role: RequestHistoryRole;
    comment?: string | null;
    createdAt: Date;
}

function getMongoConfig() {
    const uri =
        process.env.MONGO_URI ||
        process.env.MONGO_URL ||
        process.env.MONGODB_URI ||
        process.env.MONGODB_URL;

    if (!uri) {
        throw new Error(
            "MongoDB URI no definido. Configura MONGO_URI o MONGO_URL en las variables de entorno."
        );
    }

    const dbName = process.env.MONGO_DB_NAME || "aprobaciones_history";

    return { uri, dbName };
}

export async function getMongoDb(): Promise<Db> {
    if (db) return db;

    const { uri, dbName } = getMongoConfig();

    mongo = new MongoClient(uri);
    await mongo.connect();
    db = mongo.db(dbName);

    return db;
}

export async function getHistoryCollection(): Promise<
    Collection<RequestHistoryEvent>
> {
    const database = await getMongoDb();
    return database.collection<RequestHistoryEvent>("request_history");
}

export async function initMongoIndexes() {
    const collection = await getHistoryCollection();
    await collection.createIndexes([
        { key: { requestId: 1, createdAt: 1 } },
        { key: { actorId: 1, createdAt: -1 } },
        { key: { createdAt: -1 } },
    ]);
    console.info("[mongo] Índices de historial inicializados correctamente");
}
