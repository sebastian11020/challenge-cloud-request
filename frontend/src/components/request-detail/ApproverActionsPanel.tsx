import type { RequestDetail } from "../../types/request";

interface Props {
    request: RequestDetail;
    canDecide: boolean;
    decisionComment: string;
    onChangeComment: (value: string) => void;
    onApprove: () => void;
    onReject: () => void;
    loading: boolean;
}

export function ApproverActionsPanel({
                                         request,
                                         canDecide,
                                         decisionComment,
                                         onChangeComment,
                                         onApprove,
                                         onReject,
                                         loading,
                                     }: Props) {
    const isPending = request.status === "PENDIENTE";

    return (
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
                Acciones del aprobador
            </h2>

            {!canDecide && (
                <p className="text-xs text-slate-500 mb-3">
                    {isPending
                        ? "Solo el responsable asignado o un administrador puede aprobar o rechazar esta solicitud."
                        : "La solicitud ya fue procesada. Puedes revisar el historial de estados."}
                </p>
            )}

            {canDecide && (
                <p className="text-xs text-slate-500 mb-2">
                    Esta solicitud está{" "}
                    <span className="font-semibold text-slate-800">pendiente</span> de
                    tu decisión. Deja un comentario para el solicitante y selecciona
                    una acción.
                </p>
            )}

            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                        Comentario para el solicitante (opcional)
                    </label>
                    <textarea
                        value={decisionComment}
                        onChange={(e) => onChangeComment(e.target.value)}
                        rows={3}
                        className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 resize-y disabled:bg-slate-50 disabled:text-slate-400"
                        placeholder="Explica brevemente el motivo de tu decisión, impactos, condiciones, etc."
                        disabled={!canDecide || loading}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                        Se notificará al solicitante por correo con tu decisión.
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onReject}
                            disabled={!canDecide || loading}
                            className="inline-flex items-center rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                        >
                            Rechazar
                        </button>
                        <button
                            type="button"
                            onClick={onApprove}
                            disabled={!canDecide || loading}
                            className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
                        >
                            Aprobar
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
