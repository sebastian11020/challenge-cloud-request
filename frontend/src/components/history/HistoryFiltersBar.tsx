// components/history/HistoryFiltersBar.tsx
import type { RequestHistoryAction } from '../../types/history';

export interface HistoryFiltersUi {
  actorId: string;
  action: '' | RequestHistoryAction;
  from: string;
  to: string;
}

interface Props {
  filters: HistoryFiltersUi;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
}

export function HistoryFiltersBar({
  filters,
  loading,
  onChange,
  onSubmit,
  onClear,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-6 space-y-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50 p-4 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-800">Filtros de búsqueda</p>
          <p className="text-[11px] text-slate-500">
            Acota el historial por actor, tipo de acción o rango de fechas.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[11px] text-slate-50 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Historial global</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-700">
            ID de actor (actorId)
          </label>
          <input
            type="number"
            name="actorId"
            value={filters.actorId}
            onChange={onChange}
            className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            placeholder="Ej: 5"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-700">
            Acción
          </label>
          <select
            name="action"
            value={filters.action}
            onChange={onChange}
            className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          >
            <option value="">Todas</option>
            <option value="CREATED">Creación</option>
            <option value="STATUS_CHANGED">Cambio de estado</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-700">
            Desde
          </label>
          <input
            type="date"
            name="from"
            value={filters.from}
            onChange={onChange}
            className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-700">
            Hasta
          </label>
          <input
            type="date"
            name="to"
            value={filters.to}
            onChange={onChange}
            className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClear}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
        >
          Limpiar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? 'Aplicando...' : 'Aplicar filtros'}
        </button>
      </div>
    </form>
  );
}
