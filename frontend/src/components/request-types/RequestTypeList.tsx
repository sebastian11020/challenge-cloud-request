// components/request-types/RequestTypeList.tsx
import type { RequestType } from '../../types/requestType';

interface RequestTypeListProps {
  types: RequestType[];
  loading: boolean;
  error: string | null;
  onEdit: (type: RequestType) => void;
}

export function RequestTypeList({ types, loading, error, onEdit }: RequestTypeListProps) {
  const activeCount = types.filter((t) => t.active).length;
  const inactiveCount = types.filter((t) => !t.active).length;

  return (
    <section className="space-y-3">
      {/* Header de sección */}
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-sky-50 px-2.5 py-1 ring-1 ring-sky-100">
            <span className="text-[11px] font-medium text-sky-700">Catálogo</span>
            <span className="h-1 w-1 rounded-full bg-sky-400" />
            <span className="text-[11px] text-sky-500">Tipos de solicitud del flujo</span>
          </div>
          <h1 className="text-xl font-semibold text-slate-900">Tipos de solicitud</h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Administra qué tipos estarán disponibles al momento de crear solicitudes.
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
            Solo ADMIN
          </span>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>{activeCount} activos</span>
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-slate-300" />
              <span>{inactiveCount} inactivos</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-50 via-slate-50 to-sky-50 px-3 py-2 text-xs font-medium text-slate-500">
          <span>
            {loading ? 'Cargando catálogo...' : `${types.length} tipos configurados`}
          </span>
          <span className="text-[11px] text-slate-400">
            Controla disponibilidad por entorno y uso
          </span>
        </div>

        {error && (
          <div className="border-b border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        )}

        <div className="max-h-[360px] overflow-y-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 border-b border-slate-100 bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Código</th>
                <th className="px-3 py-2 text-left font-medium">Nombre</th>
                <th className="px-3 py-2 text-left font-medium">Estado</th>
                <th className="px-3 py-2 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {!loading && types.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-3 py-6 text-center text-xs text-slate-500"
                  >
                    Aún no tienes tipos configurados. Crea el primero desde el panel de la
                    derecha.
                  </td>
                </tr>
              )}

              {types.map((type) => (
                <tr
                  key={type.id}
                  className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/70"
                >
                  <td className="px-3 py-2 align-top font-mono text-[11px] text-slate-700">
                    {type.code}
                  </td>
                  <td className="px-3 py-2 align-top">
                    <div className="text-sm font-medium text-slate-900">{type.name}</div>
                    {type.description && (
                      <div className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                        {type.description}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 align-top">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        type.active
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                          : 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          type.active ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      {type.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right align-top">
                    <button
                      type="button"
                      className="text-xs font-medium text-slate-600 underline underline-offset-2 hover:text-slate-900"
                      onClick={() => onEdit(type)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
