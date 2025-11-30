import type { RequestSummary } from '../../types/request';
import { RequestRow } from './RequestRow';

interface Props {
  requests: RequestSummary[];
  onRowClick: (id: number) => void;
  page: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export function RequestTable({
  requests,
  onRowClick,
  page,
  pageSize = 8,
  onPageChange,
}: Props) {
  const total = requests.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginated = requests.slice(startIndex, endIndex);

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const showingFrom = total === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(endIndex, total);

  return (
    <div className="flex flex-col">
      <div className="max-h-[480px] overflow-y-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
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
            {paginated.map((req) => (
              <RequestRow key={req.id} req={req} onClick={onRowClick} />
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-xs text-slate-500">
                  No hay solicitudes para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
        <span>
          Mostrando {showingFrom}–{showingTo} de {total} solicitud(es)
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

          <span className="text-[11px]">
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
