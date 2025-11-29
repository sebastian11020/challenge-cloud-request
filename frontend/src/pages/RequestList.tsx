import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import type { RequestSummary } from "../types/request";
import { RequestTable } from "../components/request-list/RequestTable";
import { getMyRequests } from "../services/requestService";

export default function RequestList() {
    const { currentUser } = useUser();
    const navigate = useNavigate();

    const [requests, setRequests] = useState<RequestSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!currentUser) return;

        const fetchRequests = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getMyRequests({ applicantId: currentUser.id });
                setRequests(data);
                setPage(1); // reset a la primera página al recargar datos
            } catch (err: any) {
                console.error(err);
                setError(
                    err?.message ??
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

    const handleCreateNew = () => {
        navigate("/solicitudes/nueva");
    };

    return (
        <div>
            {/* Header */}
            <header className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">
                        Mis solicitudes
                    </h1>
                    <p className="text-xs text-slate-500">
                        Historial de solicitudes que has creado y su estado actual.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end text-[11px] text-slate-400">
            <span className="font-medium text-slate-700">
              {currentUser.displayName}
            </span>
                        <span>
              {currentUser.username} · {currentUser.role}
            </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleCreateNew}
                        className="
              inline-flex items-center rounded-full bg-slate-900
              px-3 py-1.5 text-xs font-medium text-white shadow-sm
              hover:bg-slate-800 transition-colors
            "
                    >
                        Nueva solicitud
                    </button>
                </div>
            </header>

            {/* Barra de estado arriba de la tabla */}
            <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500">
        <span>
          {loading
              ? "Cargando solicitudes..."
              : `${requests.length} solicitud(es) encontradas`}
        </span>
                <span>Estados: Pendiente, Aprobada, Rechazada</span>
            </div>

            {/* Errores */}
            {error && (
                <div className="mb-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {error}
                </div>
            )}

            {/* Estado vacío */}
            {!loading && !error && requests.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-6 text-center">
                    <p className="text-sm text-slate-600">
                        Aún no has creado solicitudes.
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        Puedes iniciar una nueva solicitud para que entre al flujo de
                        aprobación.
                    </p>
                    <button
                        type="button"
                        onClick={handleCreateNew}
                        className="
              mt-3 inline-flex items-center rounded-full bg-slate-900
              px-3 py-1.5 text-xs font-medium text-white shadow-sm
              hover:bg-slate-800 transition-colors
            "
                    >
                        Crear mi primera solicitud
                    </button>
                </div>
            )}

            {/* Tabla paginada */}
            {!loading && !error && requests.length > 0 && (
                <RequestTable
                    requests={requests}
                    onRowClick={handleRowClick}
                    page={page}
                    onPageChange={setPage}
                    pageSize={8}
                />
            )}

            {loading && (
                <p className="text-sm text-slate-500 mt-2">
                    Cargando solicitudes...
                </p>
            )}
        </div>
    );
}
