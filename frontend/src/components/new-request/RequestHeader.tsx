import { FilePlus2 } from "lucide-react";

export function RequestHeader() {
    return (
        <header className="mb-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-sm">
                <FilePlus2 size={20} />
            </div>

            <div>
                <h1 className="text-xl font-semibold text-slate-900">
                    Nueva Solicitud
                </h1>
                <p className="text-xs text-slate-500">
                    Registra una solicitud que entrará al flujo de aprobación.
                </p>
            </div>
        </header>
    );
}
