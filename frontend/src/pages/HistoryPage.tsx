// src/pages/HistoryPage.tsx
import React, { useEffect, useState } from "react";
import type { HistoryEvent, RequestHistoryAction } from "../types/history";

interface Filters {
    actorId: string;
    action: "" | RequestHistoryAction;
    from: string;
    to: string;
}

const actionLabels: Record<RequestHistoryAction, string> = {
    CREATED: "Creación",
    STATUS_CHANGED: "Cambio de estado",
};

function formatDateTime(value: string) {
    const date = new Date(value);
    return date.toLocaleString(); // ajusta a tu formato preferido
}

export const HistoryPage: React.FC = () => {
    const [events, setEvents] = useState<HistoryEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<Filters>({
        actorId: "",
        action: "",
        from: "",
        to: "",
    });

    async function fetchHistory() {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();

            if (filters.actorId.trim()) {
                params.append("actorId", filters.actorId.trim());
            }
            if (filters.action) {
                params.append("action", filters.action);
            }
            if (filters.from) {
                params.append("from", filters.from);
            }
            if (filters.to) {
                params.append("to", filters.to);
            }

            const queryString = params.toString();
            const url = queryString
                ? `/api/history?${queryString}`
                : "/api/history";

            const res = await fetch(url);
            if (!res.ok) {
                throw new Error("No se pudo cargar el historial");
            }

            const data: HistoryEvent[] = await res.json();
            setEvents(data);
        } catch (err: any) {
            setError(err.message ?? "Error al cargar el historial");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleInputChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        fetchHistory();
    }

    function handleClearFilters() {
        setFilters({
            actorId: "",
            action: "",
            from: "",
            to: "",
        });
        // recarga sin filtros
        fetchHistory();
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Historial de solicitudes</h1>
            <p className="text-sm text-gray-600 mb-6">
                Vista completa de todas las acciones realizadas sobre las solicitudes:
                quién hizo qué, cuándo y con qué resultado.
            </p>

            {/* Filtros */}
            <form
                onSubmit={handleSubmit}
                className="mb-6 p-4 border rounded-lg bg-gray-50 flex flex-col gap-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            ID de actor (actorId)
                        </label>
                        <input
                            type="number"
                            name="actorId"
                            value={filters.actorId}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2 text-sm"
                            placeholder="Ej: 5"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Acción
                        </label>
                        <select
                            name="action"
                            value={filters.action}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2 text-sm"
                        >
                            <option value="">Todas</option>
                            <option value="CREATED">Creación</option>
                            <option value="STATUS_CHANGED">Cambio de estado</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Desde
                        </label>
                        <input
                            type="date"
                            name="from"
                            value={filters.from}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Hasta
                        </label>
                        <input
                            type="date"
                            name="to"
                            value={filters.to}
                            onChange={handleInputChange}
                            className="w-full border rounded px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div className="flex gap-2 justify-end">
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
                    >
                        Limpiar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Aplicar filtros
                    </button>
                </div>
            </form>

            {/* Estado de carga / error */}
            {loading && (
                <div className="text-sm text-gray-500 mb-4">
                    Cargando historial...
                </div>
            )}
            {error && (
                <div className="text-sm text-red-600 mb-4">
                    {error}
                </div>
            )}

            {/* Tabla de resultados */}
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-3 py-2 text-left font-semibold">Solicitud</th>
                        <th className="px-3 py-2 text-left font-semibold">Acción</th>
                        <th className="px-3 py-2 text-left font-semibold">
                            Estado anterior
                        </th>
                        <th className="px-3 py-2 text-left font-semibold">
                            Estado nuevo
                        </th>
                        <th className="px-3 py-2 text-left font-semibold">Actor</th>
                        <th className="px-3 py-2 text-left font-semibold">Rol</th>
                        <th className="px-3 py-2 text-left font-semibold">Comentario</th>
                        <th className="px-3 py-2 text-left font-semibold">Fecha / hora</th>
                    </tr>
                    </thead>
                    <tbody>
                    {events.length === 0 && !loading && (
                        <tr>
                            <td
                                colSpan={8}
                                className="px-3 py-4 text-center text-gray-500"
                            >
                                No hay eventos que coincidan con los filtros.
                            </td>
                        </tr>
                    )}

                    {events.map((event, index) => (
                        <tr
                            key={event._id ?? `${event.requestId}-${event.createdAt}-${index}`}
                            className="border-t hover:bg-gray-50"
                        >
                            <td className="px-3 py-2">
                                {/* Aquí podrías linkear al detalle de la solicitud */}
                                <span className="text-blue-600 underline cursor-pointer">
                    {event.requestId}
                  </span>
                            </td>
                            <td className="px-3 py-2">
                                {actionLabels[event.action] ?? event.action}
                            </td>
                            <td className="px-3 py-2">
                                {event.previousStatus ?? "—"}
                            </td>
                            <td className="px-3 py-2">
                                {event.newStatus}
                            </td>
                            <td className="px-3 py-2">
                                <div className="flex flex-col">
                                    <span className="font-medium">{event.actor}</span>
                                    <span className="text-xs text-gray-500">
                      ID: {event.actorId}
                    </span>
                                </div>
                            </td>
                            <td className="px-3 py-2">
                                {event.role}
                            </td>
                            <td className="px-3 py-2 max-w-xs truncate" title={event.comment ?? ""}>
                                {event.comment ?? "—"}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                                {formatDateTime(event.createdAt)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
