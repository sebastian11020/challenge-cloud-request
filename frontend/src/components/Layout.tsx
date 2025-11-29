import { Link, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export function Layout() {
    const { currentUser, setCurrentUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        setCurrentUser(null);
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-100">
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    {/* Logo + Nav */}
                    <div className="flex items-center gap-6">
            <span className="font-semibold text-slate-900">
              Flujo de Aprobaciones
            </span>

                        <nav className="flex items-center gap-4 text-sm text-slate-700">
                            <Link
                                to="/dashboard"
                                className="hover:text-slate-900 transition-colors"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/solicitudes"
                                className="hover:text-slate-900 transition-colors"
                            >
                                Solicitudes
                            </Link>
                            <Link
                                to="/solicitudes/nueva"
                                className="hover:text-slate-900 transition-colors"
                            >
                                Nueva solicitud
                            </Link>

                            {/* Solo visible para ADMIN */}
                            {currentUser?.role === "ADMIN" && (
                                <Link
                                    to="/config/tipos-solicitud"
                                    className="hover:text-slate-900 transition-colors"
                                >
                                    Tipos de solicitud
                                </Link>
                            )}
                        </nav>
                    </div>

                    {/* Info de usuario + logout */}
                    {currentUser && (
                        <div className="flex items-center gap-3 text-sm">
                            <div className="text-right">
                                <p className="font-medium text-slate-900">
                                    {currentUser.displayName}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {currentUser.username} · {currentUser.role}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1.5 rounded-md border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Cambiar usuario
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-1">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
