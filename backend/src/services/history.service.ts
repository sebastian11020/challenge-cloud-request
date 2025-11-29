import {
    getHistoryCollection,
    RequestHistoryAction,
    RequestHistoryEvent,
    RequestHistoryRole,
} from "../mongo/client";

interface LogEventInput {
    requestId: number;
    action: RequestHistoryAction;
    previousStatus: string | null;
    newStatus: string;
    actorId: number;
    actor: string;
    role: RequestHistoryRole;
    comment?: string | null;
}

export async function logRequestEvent(input: LogEventInput): Promise<void> {
    const collection = await getHistoryCollection();

    const event: RequestHistoryEvent = {
        requestId: input.requestId,
        action: input.action,
        previousStatus: input.previousStatus,
        newStatus: input.newStatus,
        actorId: input.actorId,
        actor: input.actor,
        role: input.role,
        comment: input.comment ?? null,
        createdAt: new Date(),
    };

    await collection.insertOne(event);
}

// Para el rol auditor / historial completo
export async function getHistoryByRequestId(requestId: number) {
    const collection = await getHistoryCollection();
    return collection
        .find({ requestId })
        .sort({ createdAt: 1 })
        .toArray();
}

export interface HistoryFilters {
    actorId?: number;
    action?: RequestHistoryAction;
    from?: Date;
    to?: Date;
}

export async function getHistory(filters: HistoryFilters = {}) {
    const collection = await getHistoryCollection();

    const query: any = {};
    if (typeof filters.actorId === "number") query.actorId = filters.actorId;
    if (filters.action) query.action = filters.action;

    if (filters.from || filters.to) {
        query.createdAt = {};
        if (filters.from) query.createdAt.$gte = filters.from;
        if (filters.to) query.createdAt.$lte = filters.to;
    }

    return collection.find(query).sort({ createdAt: -1 }).toArray();
}
