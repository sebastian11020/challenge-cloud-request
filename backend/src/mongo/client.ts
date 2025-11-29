import { MongoClient, Db, Collection } from "mongodb";

let client: MongoClient | null = null;
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

export async function getMongoDb(): Promise<Db> {
    if (db) return db;

    const uri = process.env.MONGO_URI!;
    const dbName = process.env.MONGO_DB_NAME!;

    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);

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
}
