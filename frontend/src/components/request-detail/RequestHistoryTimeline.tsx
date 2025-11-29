import type { RequestDetail } from "../../types/request";

export function RequestHistoryTimeline({ request }: { request: RequestDetail }) {
    return (
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Detalle de la solicitud
            </h2>
            <p className="text-sm text-slate-700 whitespace-pre-line">
                {request.description}
            </p>

            <div className="mt-4">
                <h3 className="text-xs font-semibold text-slate-800 mb-2">
                    Historial de estados
                </h3>

                {request.history.length === 0 && (
                    <p className="text-xs text-slate-500">
                        No hay registros de historial.
                    </p>
                )}

                {request.history.length > 0 && (
                    <ol className="relative border-l border-slate-200 pl-3 space-y-3">
                        {request.history.map((entry) => (
                            <li key={entry.id} className="ml-1">
                                <div className="absolute -left-[9px] mt-1 h-3 w-3 rounded-full bg-white border border-slate-300" />
                                <div className="text-[11px] text-slate-400 mb-0.5">
                                    {new Date(entry.createdAt).toLocaleString()}
                                </div>
                                <div className="text-xs text-slate-700">
                  <span className="font-medium">
                    {entry.actor.displayName}
                  </span>{" "}
                                    cambió el estado{" "}
                                    <span className="font-mono text-[11px] text-slate-500">
                    {entry.previousStatus ?? "NUEVA"}
                  </span>{" "}
                                    →{" "}
                                    <span className="font-mono text-[11px] text-slate-800">
                    {entry.newStatus}
                  </span>
                                </div>

                                {entry.comment && (
                                    <div className="mt-0.5 text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-md px-2 py-1">
                                        {entry.comment}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ol>
                )}
            </div>
        </section>
    );
}
