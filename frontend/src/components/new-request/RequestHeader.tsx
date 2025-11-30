import { FilePlus2 } from 'lucide-react';

export function RequestHeader() {
  return (
    <header className="mb-5 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700 shadow-sm">
        <FilePlus2 size={20} />
      </div>

      <div>
        <h1 className="text-xl font-semibold text-slate-900">Nueva Solicitud</h1>
        <p className="text-xs text-slate-500">
          Registra una solicitud que entrará al flujo de aprobación.
        </p>
      </div>
    </header>
  );
}
