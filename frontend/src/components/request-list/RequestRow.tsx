import { STATUS_STYLES } from "../../utils/statusStyles";
import type { RequestSummary } from "../../types/request";

interface Props {
    req: RequestSummary;
    onClick: (id: number) => void;
}

export function RequestRow({ req, onClick }: Props) {
    return (
        <tr
            className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50 cursor-pointer transition"
            onClick={() => onClick(req.id)}
        >
            <td className="px-3 py-3 font-mono text-xs text-slate-700">
                {req.publicId}
            </td>

            <td className="px-3 py-3">
                <div className="text-sm font-medium text-slate-900">{req.title}</div>
            </td>

            <td className="px-3 py-3 text-xs">
                <span className="text-slate-700 font-medium">{req.requestType.name}</span>
                <div className="text-[11px] font-mono text-slate-400">
                    {req.requestType.code}
                </div>
            </td>

            <td className="px-3 py-3 text-xs text-slate-700">
                <span className="font-medium">{req.responsible.displayName}</span>
                <div className="text-[11px] text-slate-400">{req.responsible.username}</div>
            </td>

            <td className="px-3 py-3">
        <span
            className={`px-2 py-1 rounded-full text-[10px] font-semibold ${STATUS_STYLES[req.status]}`}
        >
          {req.status}
        </span>
            </td>

            <td className="px-3 py-3 text-right text-xs text-slate-500">
                {new Date(req.createdAt).toLocaleString()}
            </td>
        </tr>
    );
}
