import type { RequestSummary } from '../../types/request';

interface PaginatedProps {
  requests: RequestSummary[];
  page: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onRowClick: (id: number) => void;
}

export function ApproverInboxTable({
  requests,
  page,
  pageSize = 6,
  onPageChange,
  onRowClick,
}: PaginatedProps) {
  const total = requests.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const slice = requests.slice(startIndex, endIndex);

  const showingFrom = total === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(endIndex, total);

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex flex-col">
      <div className="max-h-[320px] overflow-y-auto">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="px-3 py-2 text-left font-medium">ID</th>
              <th className="px-3 py-2 text-left font-medium">Título</th>
              <th className="px-3 py-2 text-left font-medium">Tipo</th>
              <th className="px-3 py-2 text-left font-medium">Solicitante</th>
              <th className="px-3 py-2 text-right font-medium">Creada</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((req) => (
              <tr
                key={req.id}
                className="cursor-pointer border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
                onClick={() => onRowClick(req.id)}
              >
                <td className="px-3 py-2 align-top font-mono text-xs text-slate-700">
                  {req.publicId}
                </td>
                <td className="px-3 py-2 align-top">
                  <div className="line-clamp-2 text-sm font-medium text-slate-900">
                    {req.title}
                  </div>
                </td>
                <td className="px-3 py-2 align-top text-xs text-slate-600">
                  <div className="font-medium">{req.requestType.name}</div>
                  <div className="font-mono text-[11px] text-slate-400">
                    {req.requestType.code}
                  </div>
                </td>
                <td className="px-3 py-2 align-top text-xs text-slate-600">
                  <div className="font-medium">{req.applicant.displayName}</div>
                  <div className="text-[11px] text-slate-400">
                    {req.applicant.username}
                  </div>
                </td>
                <td className="px-3 py-2 text-right align-top text-xs text-slate-500">
                  {new Date(req.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}

            {slice.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-xs text-slate-500">
                  No hay solicitudes pendientes para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between border-t border-slate-100 px-3 py-2 text-[11px] text-slate-500">
        <span>
          Mostrando {showingFrom}–{showingTo} de {total} pendiente(s)
        </span>

        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Anterior
          </button>
          <span>
            Página <span className="font-semibold text-slate-700">{currentPage}</span> de{' '}
            {totalPages}
          </span>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentPage === totalPages || total === 0}
            className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
