import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/user";
import { useUser } from "../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

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
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h1 className="text-xl font-semibold text-slate-900 mb-1">
                    Seleccionar usuario
                </h1>
                <p className="text-sm text-slate-600 mb-4">
                    Elige un usuario de red simulado para ingresar a la aplicación.
                </p>

                {loading && (
                    <p className="text-sm text-slate-500">Cargando usuarios...</p>
                )}

                {error && (
                    <p className="text-sm text-red-600 mb-3">
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <ul className="space-y-2">
                        {users.map((user) => (
                            <li key={user.id}>
                                <button
                                    type="button"
                                    onClick={() => handleSelectUser(user)}
                                    className="w-full flex flex-col items-start px-3 py-2 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-left transition"
                                >
                  <span className="font-medium text-slate-900">
                    {user.displayName}
                  </span>
                                    <span className="text-xs text-slate-500">
                    {user.username} · {user.role}
                  </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {!loading && !error && users.length === 0 && (
                    <p className="text-sm text-slate-500">
                        No hay usuarios disponibles. Verifica el backend.
                    </p>
                )}
            </div>
        </div>
    );
}
