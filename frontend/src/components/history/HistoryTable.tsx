import type { HistoryEvent, RequestHistoryAction } from "../../types/history";

const actionLabels: Record<RequestHistoryAction, string> = {
    CREATED: "Creación",
    STATUS_CHANGED: "Cambio de estado",
};

function formatDateTime(value: string) {
    const date = new Date(value);
    return date.toLocaleString();
}

interface HistoryTableProps {
    events: HistoryEvent[];
    loading: boolean;
    error: string | null;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onRequestClick: (requestId: number) => void;
}

export function HistoryTable({
                                 events,
                                 loading,
                                 error,
                                 page,
                                 pageSize,
                                 onPageChange,
                                 onRequestClick,
                             }: HistoryTableProps) {
    const total = events.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(page, totalPages);

    const startIndex = (currentPage - 1) * pageSize;
    const pageEvents = events.slice(startIndex, startIndex + pageSize);

    const hasResults = !loading && total > 0;

    return (
        <section className="space-y-3">
            {/* Estado global / resumen */}
            <div className="flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-slate-300" />
                    {loading
                        ? "Cargando historial..."
                        : hasResults
                            ? `${total} evento(s) encontrados`
                            : "Sin resultados para los filtros actuales"}
                </div>

                {hasResults && (
                    <div className="flex items-center gap-2">
            <span>
              Página{" "}
                <span className="font-semibold text-slate-700">
                {currentPage}
              </span>{" "}
                de {totalPages}
            </span>
                    </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {error}
                </div>
            )}

            {/* Tabla */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 text-xs text-slate-500 border-b border-slate-100">
                    <tr>
                        <th className="px-3 py-2 text-left font-medium">Solicitud</th>
                        <th className="px-3 py-2 text-left font-medium">Acción</th>
                        <th className="px-3 py-2 text-left font-medium">
                            Estado anterior
                        </th>
                        <th className="px-3 py-2 text-left font-medium">Estado nuevo</th>
                        <th className="px-3 py-2 text-left font-medium">Actor</th>
                        <th className="px-3 py-2 text-left font-medium">Rol</th>
                        <th className="px-3 py-2 text-left font-medium">Comentario</th>
                        <th className="px-3 py-2 text-left font-medium">Fecha / hora</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pageEvents.length === 0 && !loading && !error && (
                        <tr>
                            <td
                                colSpan={8}
                                className="px-3 py-5 text-center text-xs text-slate-500"
                            >
                                No hay eventos que coincidan con los filtros.
                            </td>
                        </tr>
                    )}

                    {pageEvents.map((event, index) => (
                        <tr
                            key={event._id ?? `${event.requestId}-${event.createdAt}-${index}`}
                            className="border-t border-slate-100 hover:bg-slate-50/70 transition-colors"
                        >
                            <td className="px-3 py-2 align-top">
                                <button
                                    type="button"
                                    onClick={() => onRequestClick(event.requestId)}
                                    className="text-xs font-mono text-sky-700 hover:text-sky-900 underline underline-offset-2"
                                >
                                    #{event.requestId}
                                </button>
                            </td>
                            <td className="px-3 py-2 align-top text-xs">
                                {actionLabels[event.action] ?? event.action}
                            </td>
                            <td className="px-3 py-2 align-top text-xs font-mono text-slate-500">
                                {event.previousStatus ?? "—"}
                            </td>
                            <td className="px-3 py-2 align-top text-xs font-mono text-slate-800">
                                {event.newStatus}
                            </td>
                            <td className="px-3 py-2 align-top text-xs">
                                <div className="flex flex-col">
                    <span className="font-medium text-slate-800">
                      {event.actor}
                    </span>
                                    <span className="text-[11px] text-slate-500">
                      ID: {event.actorId}
                    </span>
                                </div>
                            </td>
                            <td className="px-3 py-2 align-top text-xs text-slate-700">
                                {event.role}
                            </td>
                            <td
                                className="px-3 py-2 align-top text-xs text-slate-600 max-w-xs truncate"
                                title={event.comment ?? ""}
                            >
                                {event.comment ?? "—"}
                            </td>
                            <td className="px-3 py-2 align-top text-xs text-slate-500 whitespace-nowrap">
                                {formatDateTime(event.createdAt)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Controles de paginación */}
            {hasResults && (
                <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>
            Mostrando{" "}
              <span className="font-semibold text-slate-700">
              {startIndex + 1}
            </span>{" "}
              -{" "}
              <span className="font-semibold text-slate-700">
              {Math.min(startIndex + pageSize, total)}
            </span>{" "}
              de {total}
          </span>

                    <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-1 py-0.5">
                        <button
                            type="button"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="px-2 py-1 text-xs rounded-full disabled:opacity-40 hover:bg-slate-50"
                        >
                            ← Anterior
                        </button>
                        <span className="px-2 text-[11px] text-slate-500">
              {currentPage} / {totalPages}
            </span>
                        <button
                            type="button"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="px-2 py-1 text-xs rounded-full disabled:opacity-40 hover:bg-slate-50"
                        >
                            Siguiente →
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
