import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import type { RequestDetail, RequestStatus } from "../types/request";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const STATUS_STYLES: Record<RequestStatus, string> = {
    PENDIENTE:
        "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    APROBADA:
        "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    RECHAZADA:
        "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
};

export default function DetailRequest() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUser } = useUser();

    const [request, setRequest] = useState<RequestDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [decisionComment, setDecisionComment] = useState("");

    useEffect(() => {
        const fetchRequest = async () => {
            if (!id) return;
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`${API_URL}/api/requests/${id}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error("La solicitud no existe");
                    }
                    throw new Error("Error al obtener la solicitud");
                }
                const data: RequestDetail = await res.json();
                setRequest(data);
            } catch (err: any) {
                console.error(err);
                setError(err?.message ?? "No se pudo cargar la solicitud.");
            } finally {
                setLoading(false);
            }
        };

        void fetchRequest();
    }, [id]);

    if (!currentUser) return null;

    const isSolicitante = request && currentUser.id === request.applicant.id;
    const isResponsable = request && currentUser.id === request.responsible.id;
    const isAdmin = currentUser.role === "ADMIN";

    const canDecide =
        request &&
        request.status === "PENDIENTE" &&
        (isResponsable || isAdmin);

    const handleStatusChange = async (target: "approve" | "reject") => {
        if (!request) return;

        try {
            setActionLoading(true);
            setError(null);

            const url =
                target === "approve"
                    ? `${API_URL}/api/requests/${request.id}/approve`
                    : `${API_URL}/api/requests/${request.id}/reject`;

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    actorId: currentUser.id,
                    comment: decisionComment.trim() || undefined,
                }),
            });

            if (!res.ok) {
                const body = (await res.json().catch(() => null)) as
                    | { message?: string }
                    | null;
                throw new Error(
                    body?.message ??
                    `Error al ${
                        target === "approve" ? "aprobar" : "rechazar"
                    } la solicitud`
                );
            }

            const updated: RequestDetail = await res.json();
            setRequest(updated);
            setDecisionComment("");
        } catch (err: any) {
            console.error(err);
            setError(err?.message ?? "Ocurrió un error al procesar la solicitud.");
        } finally {
            setActionLoading(false);
        }
    };

    const goBack = () => {
        // volvemos según rol
        if (currentUser.role === "APROBADOR") {
            navigate("/aprobaciones");
        } else {
            navigate("/solicitudes");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <button
                type="button"
                onClick={goBack}
                className="mb-3 text-xs text-slate-600 hover:text-slate-900"
            >
                ← Volver
            </button>

            {loading && (
                <p className="text-sm text-slate-500">Cargando solicitud...</p>
            )}

            {error && !loading && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {error}
                </div>
            )}

            {!loading && request && (
                <>
                    {/* Header principal */}
                    <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-slate-500">
                  {request.publicId}
                </span>
                                <span
                                    className={
                                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold " +
                                        STATUS_STYLES[request.status]
                                    }
                                >
                  {request.status}
                </span>
                            </div>
                            <h1 className="text-lg font-semibold text-slate-900">
                                {request.title}
                            </h1>
                            <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500">
                <span>
                  Tipo:{" "}
                    <span className="font-medium text-slate-800">
                    {request.requestType.name}
                  </span>{" "}
                    <span className="font-mono text-[10px] text-slate-400">
                    ({request.requestType.code})
                  </span>
                </span>
                                <span>•</span>
                                <span>
                  Creada: {new Date(request.createdAt).toLocaleString()}
                </span>
                            </div>
                        </div>

                        <div className="text-xs text-slate-500 space-y-1">
                            <div>
                                <div className="uppercase tracking-wide text-[10px] text-slate-400">
                                    Solicitante
                                </div>
                                <div className="font-medium text-slate-800">
                                    {request.applicant.displayName}
                                </div>
                                <div className="text-[11px]">
                                    {request.applicant.username}
                                </div>
                            </div>
                            <div className="h-px bg-slate-200" />
                            <div>
                                <div className="uppercase tracking-wide text-[10px] text-slate-400">
                                    Responsable
                                </div>
                                <div className="font-medium text-slate-800">
                                    {request.responsible.displayName}
                                </div>
                                <div className="text-[11px]">
                                    {request.responsible.username}
                                </div>
                            </div>
                            {(isSolicitante || isResponsable || isAdmin) && (
                                <div className="pt-1 text-[11px] text-slate-400">
                                    Tú eres{" "}
                                    <span className="font-semibold text-slate-700">
                    {isSolicitante
                        ? "el solicitante"
                        : isResponsable
                            ? "el responsable"
                            : "administrador"}
                  </span>{" "}
                                    de esta solicitud.
                                </div>
                            )}
                        </div>
                    </header>

                    <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)]">
                        {/* Descripción + timeline */}
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

                        {/* Panel de decisión del aprobador */}
                        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                            <h2 className="text-sm font-semibold text-slate-900 mb-2">
                                Acciones del aprobador
                            </h2>

                            {!canDecide && (
                                <p className="text-xs text-slate-500 mb-2">
                                    {request.status === "PENDIENTE"
                                        ? "Solo el responsable asignado (o un administrador) puede aprobar o rechazar esta solicitud."
                                        : "La solicitud ya fue procesada. Puedes revisar el historial de estados."}
                                </p>
                            )}

                            {canDecide && (
                                <p className="text-xs text-slate-500 mb-2">
                                    Esta solicitud está{" "}
                                    <span className="font-semibold text-slate-800">
                    pendiente
                  </span>{" "}
                                    de tu decisión. Deja un comentario para el solicitante
                                    y selecciona una acción.
                                </p>
                            )}

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-slate-700 mb-1">
                                        Comentario para el solicitante (opcional)
                                    </label>
                                    <textarea
                                        value={decisionComment}
                                        onChange={(e) => setDecisionComment(e.target.value)}
                                        rows={3}
                                        className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-y disabled:bg-slate-50 disabled:text-slate-400"
                                        placeholder="Explica brevemente el motivo de tu decisión, impactos, condiciones, etc."
                                        disabled={!canDecide || actionLoading}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-[11px] text-slate-400">
                                        Se notificará al solicitante por correo con tu decisión.
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleStatusChange("reject")}
                                            disabled={!canDecide || actionLoading}
                                            className="inline-flex items-center rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                                        >
                                            Rechazar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleStatusChange("approve")}
                                            disabled={!canDecide || actionLoading}
                                            className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
                                        >
                                            Aprobar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </>
            )}
        </div>
    );
}
