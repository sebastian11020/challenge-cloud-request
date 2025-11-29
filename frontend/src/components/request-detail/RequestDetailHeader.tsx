import type { RequestDetail } from "../../types/request";
import { STATUS_STYLES } from "../../utils/statusStyles";

interface Props {
    request: RequestDetail;
    roleLabel?: string | null;
}

export function RequestDetailHeader({ request, roleLabel }: Props) {
    return (
        <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
                    <span>Creada: {new Date(request.createdAt).toLocaleString()}</span>
                </div>
            </div>

            <div className="text-xs text-slate-500 space-y-2 bg-white/80 border border-slate-200 rounded-xl p-3 shadow-sm min-w-[190px]">
                <div>
                    <div className="uppercase tracking-wide text-[10px] text-slate-400">
                        Solicitante
                    </div>
                    <div className="font-medium text-slate-800">
                        {request.applicant.displayName}
                    </div>
                    <div className="text-[11px]">{request.applicant.username}</div>
                </div>

                <div className="h-px bg-slate-200" />

                <div>
                    <div className="uppercase tracking-wide text-[10px] text-slate-400">
                        Responsable
                    </div>
                    <div className="font-medium text-slate-800">
                        {request.responsible.displayName}
                    </div>
                    <div className="text-[11px]">{request.responsible.username}</div>
                </div>

                {roleLabel && (
                    <div className="pt-1 text-[11px] text-slate-400">
                        Tú eres{" "}
                        <span className="font-semibold text-slate-700">
              {roleLabel}
            </span>{" "}
                        en esta solicitud.
                    </div>
                )}
            </div>
        </header>
    );
}
