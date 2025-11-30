import { STATUS_STYLES } from '../../utils/statusStyles';
import type { RequestSummary } from '../../types/request';

interface Props {
  req: RequestSummary;
  onClick: (id: number) => void;
}

export function RequestRow({ req, onClick }: Props) {
  return (
    <tr
      className="cursor-pointer border-b border-slate-100 transition last:border-b-0 hover:bg-slate-50"
      onClick={() => onClick(req.id)}
    >
      <td className="px-3 py-3 font-mono text-xs text-slate-700">{req.publicId}</td>

      <td className="px-3 py-3">
        <div className="text-sm font-medium text-slate-900">{req.title}</div>
      </td>

      <td className="px-3 py-3 text-xs">
        <span className="font-medium text-slate-700">{req.requestType.name}</span>
        <div className="font-mono text-[11px] text-slate-400">{req.requestType.code}</div>
      </td>

      <td className="px-3 py-3 text-xs text-slate-700">
        <span className="font-medium">{req.responsible.displayName}</span>
        <div className="text-[11px] text-slate-400">{req.responsible.username}</div>
      </td>

      <td className="px-3 py-3">
        <span
          className={`rounded-full px-2 py-1 text-[10px] font-semibold ${STATUS_STYLES[req.status]}`}
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
