// components/request-types/RequestTypeForm.tsx
import type { FormEvent } from 'react';

export type Mode = 'create' | 'edit';

export interface RequestTypeFormState {
  id?: number;
  code: string;
  name: string;
  description: string;
  active: boolean;
}

interface RequestTypeFormProps {
  mode: Mode;
  form: RequestTypeFormState;
  saving: boolean;
  onChangeField: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onToggleActive: (checked: boolean) => void;
  onSubmit: (e: FormEvent) => void;
  onCancelEdit: () => void;
}

export function RequestTypeForm({
  mode,
  form,
  saving,
  onChangeField,
  onToggleActive,
  onSubmit,
  onCancelEdit,
}: RequestTypeFormProps) {
  const isEdit = mode === 'edit';

  return (
    <section className="space-y-3">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-sky-50 p-4 shadow-sm sm:p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-slate-50 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>{isEdit ? 'Edición de tipo' : 'Nuevo tipo de solicitud'}</span>
            </div>
            <h2 className="text-sm font-semibold text-slate-900">
              {isEdit
                ? 'Actualiza un tipo existente'
                : 'Configura un nuevo tipo para el flujo'}
            </h2>
            <p className="mt-1 max-w-md text-xs text-slate-500">
              Define el código, nombre y comportamiento del tipo. Estos valores se usan en
              el formulario de nuevas solicitudes.
            </p>
          </div>

          {isEdit && (
            <span className="hidden items-center rounded-full bg-slate-900/5 px-2 py-0.5 font-mono text-[10px] text-slate-500 sm:inline-flex">
              ID: {form.id}
            </span>
          )}
        </div>

        <form className="space-y-3" onSubmit={onSubmit}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Código interno
              </label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={onChangeField}
                disabled={isEdit}
                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-100 disabled:text-slate-400"
                placeholder="DESPLIEGUE, ACCESO, CAMBIO_TECNICO..."
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Identificador técnico. No se puede modificar al editar.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Nombre visible
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChangeField}
                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                placeholder="Ej. Despliegue, Acceso, Cambio técnico"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Descripción
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChangeField}
              rows={3}
              className="w-full resize-none rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              placeholder="Opcional. Describe brevemente cuándo se debe usar este tipo."
            />
          </div>

          {isEdit && (
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white/70 px-2.5 py-2">
              <input
                id="active"
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={(e) => onToggleActive(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <label htmlFor="active" className="select-none text-xs text-slate-700">
                Tipo activo (visible en el formulario de nuevas solicitudes)
              </label>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              <span>
                {isEdit
                  ? 'Los cambios aplican inmediatamente en el catálogo.'
                  : 'El nuevo tipo quedará disponible para todos los usuarios.'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isEdit && (
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="text-xs font-medium text-slate-500 hover:text-slate-900"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
              >
                {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear tipo'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
