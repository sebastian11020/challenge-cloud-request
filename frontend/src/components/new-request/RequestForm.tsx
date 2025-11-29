import type { FormEvent } from "react";
import type { RequestType } from "../../types/requestType";
import type { User } from "../../types/user";

interface Props {
    types: RequestType[];
    approvers: User[];
    loading: boolean;
    submitting: boolean;
    error: string | null;
    title: string;
    description: string;
    requestTypeId: number | "";
    responsibleId: number | "";
    comment: string;
    onSubmit: (e: FormEvent) => void;
    onChangeTitle: (v: string) => void;
    onChangeDescription: (v: string) => void;
    onChangeType: (v: number | "") => void;
    onChangeResponsible: (v: number | "") => void;
    onChangeComment: (v: string) => void;
}

export function RequestForm({
                                types,
                                approvers,
                                loading,
                                submitting,
                                error,
                                title,
                                description,
                                requestTypeId,
                                responsibleId,
                                comment,
                                onSubmit,
                                onChangeTitle,
                                onChangeDescription,
                                onChangeType,
                                onChangeResponsible,
                                onChangeComment,
                            }: Props) {
    return (
        <div className="bg-white/90 border border-slate-200 rounded-xl shadow-md p-5">
            {error && (
                <div className="mb-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                    {error}
                </div>
            )}

            <form className="space-y-4" onSubmit={onSubmit}>
                {/* TÍTULO */}
                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                        Título de la solicitud
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => onChangeTitle(e.target.value)}
                        placeholder="Ej. Despliegue versión 1.2.0 del servicio"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm
                       focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        required
                    />
                </div>

                {/* DESCRIPCIÓN */}
                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                        Descripción detallada
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => onChangeDescription(e.target.value)}
                        rows={4}
                        placeholder="Describe alcance, requerimiento, riesgos, etc."
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm
                       focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        required
                    />
                </div>

                {/* SELECTS */}
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                            Tipo de solicitud
                        </label>
                        <select
                            value={requestTypeId}
                            disabled={loading}
                            onChange={(e) =>
                                onChangeType(e.target.value ? Number(e.target.value) : "")
                            }
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm
                         focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-100"
                            required
                        >
                            <option value="">
                                {loading ? "Cargando tipos…" : "Selecciona un tipo"}
                            </option>

                            {types.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                            Responsable / Aprobador
                        </label>
                        <select
                            value={responsibleId}
                            disabled={loading}
                            onChange={(e) =>
                                onChangeResponsible(e.target.value ? Number(e.target.value) : "")
                            }
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm
                         focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-100"
                            required
                        >
                            <option value="">
                                {loading ? "Cargando responsables…" : "Selecciona un responsable"}
                            </option>

                            {approvers.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.displayName} ({u.username})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* COMENTARIO */}
                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                        Comentario inicial (opcional)
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => onChangeComment(e.target.value)}
                        rows={3}
                        placeholder="Notas adicionales para el aprobador…"
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm
                       focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] flex items-center gap-2 text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Se creará en estado <b>PENDIENTE</b> y se notificará al aprobador.
          </span>

                    <button
                        type="submit"
                        disabled={submitting || loading}
                        className="
              inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5
              text-xs font-medium text-white shadow-sm
              hover:bg-slate-800 disabled:opacity-60
            "
                    >
                        {submitting ? "Creando…" : "Crear solicitud"}
                    </button>
                </div>
            </form>
        </div>
    );
}
