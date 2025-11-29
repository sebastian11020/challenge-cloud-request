import { useEffect, useState, type FormEvent } from "react";
import { useUser } from "../context/UserContext";
import type { RequestType } from "../types/requestType";
import { Navigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

type Mode = "create" | "edit";

interface FormState {
    id?: number;
    code: string;
    name: string;
    description: string;
    active: boolean;
}

const emptyForm: FormState = {
    code: "",
    name: "",
    description: "",
    active: true,
};

export default function RequestTypesPage() {
    const { currentUser } = useUser();
    const [types, setTypes] = useState<RequestType[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<Mode>("create");
    const [form, setForm] = useState<FormState>(emptyForm);

    // Solo ADMIN puede acceder
    if (currentUser?.role !== "ADMIN") {
        return <Navigate to="/dashboard" replace />;
    }

    const fetchTypes = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`${API_URL}/api/request-types`);
            if (!res.ok) {
                throw new Error("Error al obtener tipos de solicitud");
            }
            const data: RequestType[] = await res.json();
            setTypes(data);
        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar los tipos de solicitud.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchTypes();
    }, []);

    const handleSelectForEdit = (type: RequestType) => {
        setMode("edit");
        setForm({
            id: type.id,
            code: type.code,
            name: type.name,
            description: type.description ?? "",
            active: type.active,
        });
    };

    const handleCancelEdit = () => {
        setMode("create");
        setForm(emptyForm);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);

            if (mode === "create") {
                const res = await fetch(`${API_URL}/api/request-types`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        code: form.code.trim(),
                        name: form.name.trim(),
                        description: form.description.trim() || undefined,
                    }),
                });

                if (!res.ok) {
                    const body = (await res.json().catch(() => null)) as
                        | { message?: string }
                        | null;
                    throw new Error(
                        body?.message ?? "Error al crear el tipo de solicitud"
                    );
                }
            } else if (mode === "edit" && form.id != null) {
                const res = await fetch(`${API_URL}/api/request-types/${form.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: form.name.trim(),
                        description: form.description.trim() || undefined,
                        active: form.active,
                    }),
                });

                if (!res.ok) {
                    const body = (await res.json().catch(() => null)) as
                        | { message?: string }
                        | null;
                    throw new Error(
                        body?.message ?? "Error al actualizar el tipo de solicitud"
                    );
                }
            }

            await fetchTypes();
            setMode("create");
            setForm(emptyForm);
        } catch (err: any) {
            console.error(err);
            setError(err?.message ?? "Ocurrió un error al guardar.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
            {/* Lista */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">
                            Tipos de solicitud
                        </h1>
                        <p className="text-xs text-slate-500">
                            Catálogo administrable de tipos que se pueden usar al crear solicitudes.
                        </p>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
            Solo ADMIN
          </span>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="border-b border-slate-100 bg-slate-50/60 px-3 py-2 text-xs font-medium text-slate-500">
                        {loading ? "Cargando..." : `${types.length} tipos configurados`}
                    </div>

                    {error && (
                        <div className="px-3 py-2 text-xs text-red-600 border-b border-red-100 bg-red-50">
                            {error}
                        </div>
                    )}

                    <div className="max-h-[360px] overflow-y-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 text-xs text-slate-500 border-b border-slate-100">
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
                                        className="px-3 py-4 text-xs text-slate-500 text-center"
                                    >
                                        No hay tipos configurados. Crea uno desde el formulario.
                                    </td>
                                </tr>
                            )}

                            {types.map((type) => (
                                <tr
                                    key={type.id}
                                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
                                >
                                    <td className="px-3 py-2 align-top font-mono text-xs text-slate-700">
                                        {type.code}
                                    </td>
                                    <td className="px-3 py-2 align-top">
                                        <div className="text-sm font-medium text-slate-900">
                                            {type.name}
                                        </div>
                                        {type.description && (
                                            <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                                {type.description}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 align-top">
                      <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              type.active
                                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                                  : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
                          }`}
                      >
                        {type.active ? "Activo" : "Inactivo"}
                      </span>
                                    </td>
                                    <td className="px-3 py-2 align-top text-right">
                                        <button
                                            type="button"
                                            className="text-xs font-medium text-slate-600 hover:text-slate-900 underline underline-offset-2"
                                            onClick={() => handleSelectForEdit(type)}
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

            {/* Form */}
            <section>
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <h2 className="text-sm font-semibold text-slate-900 mb-1">
                        {mode === "create" ? "Nuevo tipo de solicitud" : "Editar tipo de solicitud"}
                    </h2>
                    <p className="text-xs text-slate-500 mb-4">
                        Define el catálogo de tipos que los usuarios pueden seleccionar al crear una
                        solicitud.
                    </p>

                    <form className="space-y-3" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                Código interno
                            </label>
                            <input
                                type="text"
                                name="code"
                                value={form.code}
                                onChange={handleChange}
                                disabled={mode === "edit"}
                                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50 disabled:text-slate-400"
                                placeholder="DESPLIEGUE, ACCESO, CAMBIO_TECNICO..."
                            />
                            <p className="mt-1 text-[11px] text-slate-400">
                                Se usa como identificador estable. No se puede cambiar al editar.
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                Nombre visible
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                                placeholder="Ej. Despliegue, Acceso, Cambio técnico"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                Descripción
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-none"
                                placeholder="Opcional. Describe brevemente cuándo se debe usar este tipo."
                            />
                        </div>

                        {mode === "edit" && (
                            <div className="flex items-center gap-2">
                                <input
                                    id="active"
                                    type="checkbox"
                                    name="active"
                                    checked={form.active}
                                    onChange={handleCheckboxChange}
                                    className="h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                />
                                <label
                                    htmlFor="active"
                                    className="text-xs text-slate-700 select-none"
                                >
                                    Tipo activo (visible en el formulario de nuevas solicitudes)
                                </label>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                                <span>
                  {mode === "create"
                      ? "Creará un nuevo tipo disponible para todos los usuarios."
                      : "Actualiza cómo se mostrará este tipo en el catálogo."}
                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {mode === "edit" && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
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
                                    {saving
                                        ? "Guardando..."
                                        : mode === "create"
                                            ? "Crear tipo"
                                            : "Guardar cambios"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}
