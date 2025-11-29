import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";   // 👈 NUEVO
import { useUser } from "../context/UserContext";
import { useRequestDetail } from "../hooks/useRequestDetail";
import { changeRequestStatusApi } from "../services/requestService";
import { RequestDetailHeader } from "../components/request-detail/RequestDetailHeader";
import { RequestHistoryTimeline } from "../components/request-detail/RequestHistoryTimeline";
import { ApproverActionsPanel } from "../components/request-detail/ApproverActionsPanel";

export default function DetailRequest() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUser } = useUser();
    const { request, loading, error, setRequest } = useRequestDetail(id);
    const [actionLoading, setActionLoading] = useState(false);
    const [decisionComment, setDecisionComment] = useState("");

    if (!currentUser) return null;

    const goBack = () => {
        if (currentUser.role === "APROBADOR") {
            navigate("/aprobaciones");
        } else {
            navigate("/solicitudes");
        }
    };

    const isSolicitante = !!request && currentUser.id === request.applicant.id;
    const isResponsable = !!request && currentUser.id === request.responsible.id;
    const isAdmin = currentUser.role === "ADMIN";

    const canDecide =
        !!request &&
        request.status === "PENDIENTE" &&
        (isResponsable || isAdmin);

    const roleLabel = isSolicitante
        ? "el solicitante"
        : isResponsable
            ? "el responsable"
            : isAdmin
                ? "administrador"
                : null;

    const handleStatusChange = async (target: "approve" | "reject") => {
        if (!request || !currentUser) return;

        try {
            setActionLoading(true);

            const updated = await changeRequestStatusApi({
                requestId: request.id,
                target,
                actorId: currentUser.id,
                comment: decisionComment,
            });

            setRequest(updated);
            setDecisionComment("");
        } catch (err: any) {
            console.error(err);
            alert(
                err?.message ??
                `Ocurrió un error al ${
                    target === "approve" ? "aprobar" : "rechazar"
                } la solicitud.`
            );
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div>
            <button
                type="button"
                onClick={goBack}
                className="
          mb-3 inline-flex items-center gap-1.5
          rounded-full border border-slate-200 bg-white
          px-3 py-1 text-[11px] font-medium text-slate-600
          shadow-sm hover:bg-slate-50 hover:border-slate-300
          transition-colors
        "
            >
                <ArrowLeft size={14} className="text-slate-500" />
                <span>Volver</span>
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
                    <RequestDetailHeader request={request} roleLabel={roleLabel} />

                    <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)]">
                        <RequestHistoryTimeline request={request} />

                        {(isResponsable || isAdmin) && (
                            <ApproverActionsPanel
                                request={request}
                                canDecide={canDecide}
                                decisionComment={decisionComment}
                                onChangeComment={setDecisionComment}
                                onApprove={() => handleStatusChange("approve")}
                                onReject={() => handleStatusChange("reject")}
                                loading={actionLoading}
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
