import {
    useEffect,
    useState,
    type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import type { RequestType } from "../types/requestType";
import type { User } from "../types/user";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

interface CreatedRequest {
    id: number;
    publicId: string;
}

export default function NewRequest() {
    const { currentUser } = useUser();
    const navigate = useNavigate();

    const [types, setTypes] = useState<RequestType[]>([]);
    const [approvers, setApprovers] = useState<User[]>([]);

    const [loadingCatalogs, setLoadingCatalogs] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [requestTypeId, setRequestTypeId] = useState<number | "">("");
    const [responsibleId, setResponsibleId] = useState<number | "">("");
    const [comment, setComment] = useState("");

    useEffect(() => {
        const loadCatalogs = async () => {
            try {
                setLoadingCatalogs(true);
                setError(null);

                const [typesRes, usersRes] = await Promise.all([
                    fetch(`${API_URL}/api/request-types`),
                    fetch(`${API_URL}/api/users`),
                ]);

                if (!typesRes.ok) {
                    throw new Error("Error al obtener tipos de solicitud");
                }
                if (!usersRes.ok) {
                    throw new Error("Error al obtener usuarios");
                }

                const typesData: RequestType[] = await typesRes.json();
                const usersData: User[] = await usersRes.json();

                // Solo tipos activos
                setTypes(typesData.filter((t) => t.active));

                // Solo usuarios rol APROBADOR
                setApprovers(usersData.filter((u) => u.role === "APROBADOR"));
            } catch (err) {
                console.error(err);
                setError(
                    "No se pudieron cargar los catálogos necesarios. Intenta nuevamente."
                );
            } finally {
                setLoadingCatalogs(false);
            }
        };

        void loadCatalogs();
    }, []);

    if (!currentUser) {
        // En teoría ProtectedRoute ya bloquea esto, pero por seguridad:
        return null;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!requestTypeId || !responsibleId) {
            setError("Debes seleccionar un tipo de solicitud y un responsable.");
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const payload = {
                title: title.trim(),
                description: description.trim(),
                requestTypeId: Number(requestTypeId),
                applicantId: currentUser.id,
                responsibleId: Number(responsibleId),
                comment: comment.trim() || undefined,
            };

            const res = await fetch(`${API_URL}/api/requests`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const body = (await res.json().catch(() => null)) as
                    | { message?: string }
                    | null;
                throw new Error(
                    body?.message ?? "Error al crear la solicitud. Intenta nuevamente."
                );
            }

            const data = (await res.json()) as CreatedRequest;

            // Navegamos al detalle de la solicitud recién creada
            navigate(`/solicitudes/${data.id}`);
        } catch (err: any) {
            console.error(err);
            setError(err?.message ?? "Ocurrió un error al crear la solicitud.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <header className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">
                        Nueva solicitud
                    </h1>
                    <p className="text-xs text-slate-500">
                        Crea una solicitud que entrará en el flujo de aprobación del banco.
                    </p>
                </div>

                <div className="inline-flex flex-col items-end">
          <span className="text-[11px] text-slate-500">
            Solicitante actual
          </span>
                    <span className="text-xs font-medium text-slate-900">
            {currentUser.displayName}
          </span>
                    <span className="text-[11px] text-slate-400">
            {currentUser.username} · {currentUser.role}
          </span>
                </div>
            </header>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5">
                {error && (
                    <div className="mb-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Título */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                            Título de la solicitud
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                            placeholder="Ej. Despliegue versión 1.2.0 de servicio de pagos"
                            required
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                            Descripción detallada
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-y"
                            placeholder="Describe qué se requiere, en qué entorno, alcance, dependencias, ventanas de tiempo, etc."
                            required
                        />
                    </div>

                    {/* Tipo + Responsable */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                Tipo de solicitud
                            </label>
                            <select
                                value={requestTypeId}
                                onChange={(e) =>
                                    setRequestTypeId(
                                        e.target.value ? Number(e.target.value) : ""
                                    )
                                }
                                disabled={loadingCatalogs}
                                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50 disabled:text-slate-400"
                                required
                            >
                                <option value="">
                                    {loadingCatalogs
                                        ? "Cargando tipos..."
                                        : "Selecciona un tipo"}
                                </option>
                                {types.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name} ({type.code})
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-[11px] text-slate-400">
                                El catálogo se puede ampliar desde Configuración &gt; Tipos de
                                solicitud.
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                Responsable / Aprobador
                            </label>
                            <select
                                value={responsibleId}
                                onChange={(e) =>
                                    setResponsibleId(
                                        e.target.value ? Number(e.target.value) : ""
                                    )
                                }
                                disabled={loadingCatalogs}
                                className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50 disabled:text-slate-400"
                                required
                            >
                                <option value="">
                                    {loadingCatalogs
                                        ? "Cargando responsables..."
                                        : "Selecciona un responsable"}
                                </option>
                                {approvers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.displayName} ({user.username})
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-[11px] text-slate-400">
                                Solo se muestran usuarios con rol APROBADOR.
                            </p>
                        </div>
                    </div>

                    {/* Comentario opcional */}
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                            Comentario inicial (opcional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-y"
                            placeholder="Notas para el aprobador: contexto, riesgos, ventanas de cambio, etc."
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                            <span>
                La solicitud se creará en estado{" "}
                                <span className="font-semibold">PENDIENTE</span> y se notificará
                al responsable por correo.
              </span>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || loadingCatalogs}
                            className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
                        >
                            {submitting ? "Creando..." : "Crear solicitud"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
