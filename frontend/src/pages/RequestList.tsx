import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useRequests } from "../hooks/useRequests";
import { RequestListHeader } from "../components/request-list/RequestListHeader";
import { RequestTable } from "../components/request-list/RequestTable";

export default function RequestList() {
    const { currentUser } = useUser();
    const navigate = useNavigate();

    if (!currentUser) return null;

    // @ts-ignore
    const { requests, loading, error } = useRequests(currentUser.id);

    const goToRequest = (id: number) => navigate(`/solicitudes/${id}`);

    return (
        <div className="space-y-4">
            <RequestListHeader user={currentUser} />

            {/* Banner superior */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
          <span>
            {loading
                ? "Cargando solicitudes…"
                : `${requests.length} solicitud(es) encontradas`}
          </span>

                    <span className="text-[11px]">
            Pendiente · Aprobada · Rechazada
          </span>
                </div>

                {/* Error */}
                {error && (
                    <div className="px-4 py-3 text-xs bg-red-50 text-red-700 border-b border-red-100">
                        {error}
                    </div>
                )}

                {/* Vacío */}
                {!loading && !error && requests.length === 0 && (
                    <div className="py-6 text-center text-sm text-slate-500">
                        No has creado solicitudes aún.
                        <button
                            onClick={() => navigate("/solicitudes/nueva")}
                            className="ml-1 text-slate-900 font-medium underline underline-offset-2"
                        >
                            Crear nueva
                        </button>
                    </div>
                )}

                {/* Tabla */}
                {!loading && requests.length > 0 && (
                    <RequestTable requests={requests} onRowClick={goToRequest} />
                )}
            </div>
        </div>
    );
}
