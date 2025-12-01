// src/services/history.service.ts
import {
    getHistoryCollection,
    type RequestHistoryAction,
    type RequestHistoryEvent,
    type RequestHistoryRole,
} from "../../db/mongo";

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

export async function getHistoryByRequestId(requestId: number) {
    const collection = await getHistoryCollection();
    return collection.find({ requestId }).sort({ createdAt: 1 }).toArray();
}

export interface HistoryFilters {
    actorId?: number;
    action?: RequestHistoryAction;
    from?: Date;
    to?: Date;
}

export async function getHistory(filters: HistoryFilters = {}) {
    const collection = await getHistoryCollection();

    const query: Record<string, unknown> = {};

    if (typeof filters.actorId === "number") {
        query.actorId = filters.actorId;
    }

    if (filters.action) {
        query.action = filters.action;
    }

    if (filters.from || filters.to) {
        const createdAt: Record<string, Date> = {};
        if (filters.from) createdAt.$gte = filters.from;
        if (filters.to) createdAt.$lte = filters.to;
        query.createdAt = createdAt;
    }

    return collection.find(query).sort({ createdAt: -1 }).toArray();
}
