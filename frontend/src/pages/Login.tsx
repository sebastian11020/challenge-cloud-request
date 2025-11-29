// src/pages/Login.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/user";
import { useUser } from "../context/UserContext";
import { getUsers } from "../services/userService";
import { UserTile } from "../components/users/UserTile";

export default function Login() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { setCurrentUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setError(null);
                const data = await getUsers();
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
        <div className="
  min-h-screen flex flex-col
  bg-gradient-to-br from-[#1e2e4a] via-[#243b63] to-[#1b2741]
  text-slate-50
">
            {/* Header */}
            <header className="w-full pt-8 pb-4">
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-slate-950/80 flex items-center justify-center shadow-md">
              <span className="text-sm font-bold tracking-tight text-slate-50">
                FA
              </span>
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-semibold">
                                Flujo de Aprobaciones
                            </h1>
                            <p className="text-xs text-slate-300">
                                Selecciona un usuario para ingresar al entorno demo.
                            </p>
                        </div>
                    </div>

                    <span className="inline-flex items-center rounded-full border border-slate-500/70 px-4 py-1.5 text-[11px] font-semibold text-slate-100 bg-slate-900/80">
            Entorno demo
          </span>
                </div>
            </header>

            {/* Main */}
            <main className="flex flex-1">
                <div className="max-w-6xl mx-auto px-6 w-full flex flex-col items-center pt-10">
                    <section className="w-full max-w-4xl">
                        {/* Título sección */}
                        <div className="mb-6">
                            <p className="text-sm font-medium text-slate-50">
                                Seleccionar usuario
                            </p>
                            <p className="text-xs text-slate-300">
                                Elige un perfil de usuario para simular el flujo de aprobación.
                            </p>
                        </div>

                        {/* Loading */}
                        {loading && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
                                <span className="h-2 w-2 rounded-full bg-slate-300 animate-pulse" />
                                <span>Cargando usuarios...</span>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="mt-3 max-w-md rounded-lg border border-red-400/70 bg-red-500/15 px-3 py-2 text-xs text-red-100">
                                {error}
                            </div>
                        )}

                        {/* Grid de usuarios */}
                        {!loading && !error && users.length > 0 && (
                            <div
                                className="
                  mt-8 grid
                  grid-cols-1 sm:grid-cols-3
                  gap-8
                  justify-items-center
                "
                            >
                                {users.map((user) => (
                                    <UserTile
                                        key={user.id}
                                        user={user}
                                        onSelect={handleSelectUser}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Vacío */}
                        {!loading && !error && users.length === 0 && (
                            <p className="mt-4 text-xs text-slate-300">
                                No hay usuarios registrados. Verifica que el backend esté en ejecución.
                            </p>
                        )}
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-4">
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-[11px] text-slate-500">
                    <p>Banco • Centro de Excelencia</p>
                    <p>v0.1 · Cloud Challenge</p>
                </div>
            </footer>
        </div>
    );
}
