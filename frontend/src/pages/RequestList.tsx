import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import type { RequestSummary } from "../types/request";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const STATUS_STYLES: Record<
    RequestSummary["status"],
    string
> = {
    PENDIENTE:
        "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
    APROBADA:
        "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    RECHAZADA:
        "bg-rose-50 text-rose-700 ring-1 ring-rose-100",
};

export default function RequestList() {
    const { currentUser } = useUser();
    const navigate = useNavigate();

    const [requests, setRequests] = useState<RequestSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!currentUser) return;

        const fetchRequests = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(
                    `${API_URL}/api/requests?applicantId=${currentUser.id}`
                );
                if (!res.ok) {
                    throw new Error("Error al obtener solicitudes");
                }
                const data: RequestSummary[] = await res.json();
                setRequests(data);
            } catch (err) {
                console.error(err);
                setError(
                    "No se pudieron cargar tus solicitudes. Intenta nuevamente."
                );
            } finally {
                setLoading(false);
            }
        };

        void fetchRequests();
    }, [currentUser]);

    if (!currentUser) return null;

    const handleRowClick = (requestId: number) => {
        navigate(`/solicitudes/${requestId}`);
    };

    return (
        <div>
            <header className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">
                        Mis solicitudes
                    </h1>
                    <p className="text-xs text-slate-500">
                        Historial de solicitudes que has creado y su estado actual.
                    </p>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                    <div className="font-medium text-slate-700">
                        {currentUser.displayName}
                    </div>
                    <div>
                        {currentUser.username} · {currentUser.role}
                    </div>
                </div>
            </header>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/60 text-xs text-slate-500">
          <span>
            {loading
                ? "Cargando solicitudes..."
                : `${requests.length} solicitud(es) encontradas`}
          </span>
                    <span>
            Estados: Pendiente, Aprobada, Rechazada
          </span>
                </div>

                {error && (
                    <div className="px-3 py-2 border-b border-red-100 bg-red-50 text-xs text-red-700">
                        {error}
                    </div>
                )}

                {!loading && !error && requests.length === 0 && (
                    <div className="px-4 py-6 text-sm text-slate-500 text-center">
                        Aún no has creado solicitudes. Empieza desde{" "}
                        <button
                            type="button"
                            className="text-slate-900 font-medium underline underline-offset-2"
                            onClick={() => navigate("/solicitudes/nueva")}
                        >
                            Nueva solicitud
                        </button>
                        .
                    </div>
                )}

                {!loading && requests.length > 0 && (
                    <div className="max-h-[480px] overflow-y-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 text-xs text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="px-3 py-2 text-left font-medium">
                                    ID
                                </th>
                                <th className="px-3 py-2 text-left font-medium">
                                    Título
                                </th>
                                <th className="px-3 py-2 text-left font-medium">
                                    Tipo
                                </th>
                                <th className="px-3 py-2 text-left font-medium">
                                    Responsable
                                </th>
                                <th className="px-3 py-2 text-left font-medium">
                                    Estado
                                </th>
                                <th className="px-3 py-2 text-right font-medium">
                                    Creada
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {requests.map((req) => (
                                <tr
                                    key={req.id}
                                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70 cursor-pointer"
                                    onClick={() => handleRowClick(req.id)}
                                >
                                    <td className="px-3 py-2 align-top font-mono text-xs text-slate-700">
                                        {req.publicId}
                                    </td>
                                    <td className="px-3 py-2 align-top">
                                        <div className="text-sm font-medium text-slate-900 line-clamp-2">
                                            {req.title}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 align-top text-xs text-slate-600">
                                        <div className="font-medium">
                                            {req.requestType.name}
                                        </div>
                                        <div className="font-mono text-[11px] text-slate-400">
                                            {req.requestType.code}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 align-top text-xs text-slate-600">
                                        <div className="font-medium">
                                            {req.responsible.displayName}
                                        </div>
                                        <div className="text-[11px] text-slate-400">
                                            {req.responsible.username}
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 align-top">
                      <span
                          className={
                              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold " +
                              STATUS_STYLES[req.status]
                          }
                      >
                        {req.status}
                      </span>
                                    </td>
                                    <td className="px-3 py-2 align-top text-right text-xs text-slate-500">
                                        {new Date(req.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
