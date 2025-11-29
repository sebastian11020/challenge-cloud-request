// pages/ApproverRequestsPage.tsx
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useApproverRequests } from "../hooks/useApproverRequests";
import { ApproverInboxTable } from "../components/approver/ApproverInboxTable";
import { ApproverHistoryTable } from "../components/approver/ApproverHistoryTable";

export default function ApproverRequestsPage() {
    const { currentUser } = useUser();
    const navigate = useNavigate();

    const [pendingPage, setPendingPage] = useState(1);
    const [historyPage, setHistoryPage] = useState(1);

    if (!currentUser) return null;
    if (currentUser.role !== "APROBADOR" && currentUser.role !== "ADMIN") {
        return <Navigate to="/dashboard" replace />;
    }

    const { pending, history, loading, error } = useApproverRequests(
        currentUser.id
    );

    const handleRowClick = (id: number) => {
        navigate(`/solicitudes/${id}`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <header className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">
                        Bandeja de aprobación
                    </h1>
                    <p className="text-xs text-slate-500">
                        Revisa y gestiona las solicitudes que te han sido asignadas.
                    </p>
                </div>

                <div className="flex flex-col items-end text-[11px] text-slate-400">
          <span className="font-medium text-slate-700">
            {currentUser.displayName}
          </span>
                    <span>
            {currentUser.username} · {currentUser.role}
          </span>
                </div>
            </header>

            {/* Bandeja de entrada */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/60 text-xs text-slate-500">
                    <span>Bandeja de entrada</span>
                    <span>
            {loading
                ? "Cargando..."
                : `${pending.length} solicitud(es) pendiente(s)`}
          </span>
                </div>

                {error && (
                    <div className="px-3 py-2 border-b border-red-100 bg-red-50 text-xs text-red-700">
                        {error}
                    </div>
                )}

                {!loading && !error && pending.length === 0 && (
                    <div className="px-4 py-5 text-sm text-slate-500">
                        No tienes solicitudes pendientes por aprobar.
                    </div>
                )}

                {!loading && !error && pending.length > 0 && (
                    <ApproverInboxTable
                        requests={pending}
                        page={pendingPage}
                        onPageChange={setPendingPage}
                        onRowClick={handleRowClick}
                    />
                )}
            </section>

            {/* Historial del aprobador */}
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/60 text-xs text-slate-500">
                    <span>Historial de decisiones</span>
                    <span>
            {loading
                ? "Cargando..."
                : `${history.length} solicitud(es) procesadas`}
          </span>
                </div>

                {!loading && !error && history.length === 0 && (
                    <div className="px-4 py-5 text-sm text-slate-500">
                        Aún no has aprobado ni rechazado solicitudes.
                    </div>
                )}

                {!loading && !error && history.length > 0 && (
                    <ApproverHistoryTable
                        requests={history}
                        page={historyPage}
                        onPageChange={setHistoryPage}
                        onRowClick={handleRowClick}
                    />
                )}
            </section>

            {loading && (
                <p className="text-sm text-slate-500">
                    Cargando solicitudes asignadas...
                </p>
            )}
        </div>
    );
}
