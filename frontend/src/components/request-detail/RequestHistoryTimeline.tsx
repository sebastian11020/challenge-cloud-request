import type { RequestDetail } from '../../types/request';

export function RequestHistoryTimeline({ request }: { request: RequestDetail }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-sm font-semibold text-slate-900">
        Detalle de la solicitud
      </h2>
      <p className="whitespace-pre-line text-sm text-slate-700">{request.description}</p>

      <div className="mt-4">
        <h3 className="mb-2 text-xs font-semibold text-slate-800">
          Historial de estados
        </h3>

        {request.history.length === 0 && (
          <p className="text-xs text-slate-500">No hay registros de historial.</p>
        )}

        {request.history.length > 0 && (
          <ol className="relative space-y-3 border-l border-slate-200 pl-3">
            {request.history.map((entry) => (
              <li key={entry.id} className="ml-1">
                <div className="absolute -left-[9px] mt-1 h-3 w-3 rounded-full border border-slate-300 bg-white" />
                <div className="mb-0.5 text-[11px] text-slate-400">
                  {new Date(entry.createdAt).toLocaleString()}
                </div>
                <div className="text-xs text-slate-700">
                  <span className="font-medium">{entry.actor.displayName}</span> cambió el
                  estado{' '}
                  <span className="font-mono text-[11px] text-slate-500">
                    {entry.previousStatus ?? 'NUEVA'}
                  </span>{' '}
                  →{' '}
                  <span className="font-mono text-[11px] text-slate-800">
                    {entry.newStatus}
                  </span>
                </div>

                {entry.comment && (
                  <div className="mt-0.5 rounded-md border border-slate-100 bg-slate-50 px-2 py-1 text-xs text-slate-600">
                    {entry.comment}
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
