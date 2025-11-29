import type { RequestSummary } from "../../types/request";
import { RequestRow } from "./RequestRow";

interface Props {
    requests: RequestSummary[];
    onRowClick: (id: number) => void;
}

export function RequestTable({ requests, onRowClick }: Props) {
    return (
        <div className="max-h-[480px] overflow-y-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                    <th className="px-3 py-2 text-left">ID</th>
                    <th className="px-3 py-2 text-left">Título</th>
                    <th className="px-3 py-2 text-left">Tipo</th>
                    <th className="px-3 py-2 text-left">Responsable</th>
                    <th className="px-3 py-2 text-left">Estado</th>
                    <th className="px-3 py-2 text-right">Creada</th>
                </tr>
                </thead>

                <tbody>
                {requests.map((req) => (
                    <RequestRow key={req.id} req={req} onClick={onRowClick} />
                ))}
                </tbody>
            </table>
        </div>
    );
}
