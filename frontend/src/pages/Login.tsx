import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/user";
import { useUser } from "../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const ROLE_LABELS: Record<User["role"], string> = {
    SOLICITANTE: "Solicitante",
    APROBADOR: "Aprobador",
    ADMIN: "Administrador",
};

const ROLE_COLORS: Record<User["role"], string> = {
    SOLICITANTE: "bg-blue-50 text-blue-700 ring-blue-100",
    APROBADOR: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    ADMIN: "bg-amber-50 text-amber-700 ring-amber-100",
};

export default function Login() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { setCurrentUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`${API_URL}/api/users`);
                if (!res.ok) {
                    throw new Error("Error al obtener usuarios");
                }
                const data: User[] = await res.json();
                setUsers(data);
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar los usuarios. Intenta nuevamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleSelectUser = (user: User) => {
        setCurrentUser(user);
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_at_top,_#1e293b_0,_#020617_55%)] px-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="relative bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-2xl shadow-[0_18px_45px_rgba(15,23,42,0.35)] p-6 sm:p-7">
                    {/* Icon / logo */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
              <span className="text-sm font-semibold tracking-tight text-slate-50">
                FA
              </span>
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-semibold text-slate-900 leading-tight">
                                Flujo de Aprobaciones
                            </h1>
                            <p className="text-xs text-slate-500">
                                Inicia sesión como un usuario de red simulado.
                            </p>
                        </div>
                    </div>

                    {/* Título sección */}
                    <div className="mb-4 flex items-center justify-between gap-2">
                        <div>
                            <p className="text-sm font-medium text-slate-900">
                                Seleccionar usuario
                            </p>
                            <p className="text-xs text-slate-500">
                                Elige un perfil para usar la aplicación.
                            </p>
                        </div>
                        <span className="inline-flex items-center rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-500 bg-slate-50/80">
              Entorno demo
            </span>
                    </div>

                    {/* Estados */}
                    {loading && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                            <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse" />
                            <span>Cargando usuarios...</span>
                        </div>
                    )}

                    {error && (
                        <div className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Lista de usuarios */}
                    {!loading && !error && (
                        <ul className="mt-3 space-y-2 max-h-64 overflow-y-auto pr-1">
                            {users.map((user) => (
                                <li key={user.id}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelectUser(user)}
                                        className="group w-full flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left shadow-sm hover:border-slate-300 hover:shadow-md hover:-translate-y-[1px] transition-all duration-150"
                                    >
                                        {/* Avatar inicial */}
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-slate-50">
                                            {user.displayName
                                                .split(" ")
                                                .map((p) => p[0])
                                                .join("")
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-slate-900 text-sm truncate">
                          {user.displayName}
                        </span>
                                                <span
                                                    className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${ROLE_COLORS[user.role]}`}
                                                >
                          {ROLE_LABELS[user.role]}
                        </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {user.username}
                                            </p>
                                        </div>

                                        {/* Flecha */}
                                        <span className="ml-1 text-slate-300 group-hover:text-slate-500 transition-colors">
                      →
                    </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {!loading && !error && users.length === 0 && (
                        <p className="mt-3 text-xs text-slate-500">
                            No hay usuarios disponibles. Verifica que el backend esté en
                            ejecución.
                        </p>
                    )}

                    {/* Pie de card */}
                    <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between">
                        <p className="text-[11px] text-slate-400">
                            Banco • Centro de Excelencia (demo)
                        </p>
                        <p className="text-[11px] text-slate-400">
                            v0.1 · Cloud Challenge
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
