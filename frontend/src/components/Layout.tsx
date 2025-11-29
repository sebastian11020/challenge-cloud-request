import { Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getInitials } from "../utils/GetInitials";
import { NavItem } from "./NavItem";

const ROLE_LABELS: Record<string, string> = {
    SOLICITANTE: "Solicitante",
    APROBADOR: "Aprobador",
    ADMIN: "Administrador",
};

export function Layout() {
    const { currentUser, setCurrentUser } = useUser();
    const navigate = useNavigate();

    if (!currentUser) return null;

    const isSolicitante = currentUser.role === "SOLICITANTE";
    const isAprobador = currentUser.role === "APROBADOR";
    const isAdmin = currentUser.role === "ADMIN";

    const handleLogout = () => {
        setCurrentUser(null);
        navigate("/login");
    };

    return (
        <div className="
      min-h-screen flex flex-col
      bg-gradient-to-br from-slate-100 via-white to-slate-100
      bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.18),transparent_70%)]
    ">
            {/* Header */}
            <header className="
        sticky top-0 z-20 bg-white/80 backdrop-blur-md
        border-b border-slate-200 shadow-sm
      ">
                <div className="
          max-w-6xl mx-auto px-4 py-4
          flex items-center justify-between
        ">

                    {/* Logo + Title */}
                    <div className="flex items-center gap-3">
                        <div className="
              h-10 w-10 flex items-center justify-center
              rounded-xl bg-slate-900 text-white font-semibold text-sm shadow-sm
            ">
                            FA
                        </div>
                        <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-semibold text-slate-900">
                Flujo de Aprobaciones
              </span>
                            <span className="text-[11px] text-slate-500">
                Banco · Centro de Excelencia
              </span>
                        </div>
                    </div>

                    {/* NAVBAR CENTRADO */}
                    <nav className="
            hidden md:flex items-center gap-6
            text-sm font-medium text-slate-600
          ">
                        <NavItem to="/dashboard">Dashboard</NavItem>

                        {(isSolicitante || isAdmin) && (
                            <>
                                <NavItem to="/solicitudes">Mis solicitudes</NavItem>
                                <NavItem to="/solicitudes/nueva">Nueva solicitud</NavItem>
                            </>
                        )}

                        {(isAprobador || isAdmin) && (
                            <NavItem to="/aprobaciones">Bandeja de aprobación</NavItem>
                        )}

                        {isAdmin && (
                            <>
                                <NavItem to="/config/tipos-solicitud">Tipos de solicitud</NavItem>
                                <NavItem to="/historial">Historial</NavItem>
                            </>
                        )}
                    </nav>

                    {/* User info */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex flex-col text-right leading-tight text-sm">
              <span className="font-medium text-slate-900">
                {currentUser.displayName}
              </span>
                            <span className="text-[11px] text-slate-500">
                {currentUser.username} · {ROLE_LABELS[currentUser.role]}
              </span>
                        </div>

                        <div className="
              h-9 w-9 flex items-center justify-center
              rounded-full bg-slate-900 text-white text-xs font-semibold shadow-sm
            ">
                            {getInitials(currentUser.displayName)}
                        </div>

                        <button
                            onClick={handleLogout}
                            className="
                hidden sm:inline-flex px-3 py-1.5
                text-xs font-medium rounded-md
                border border-slate-300 bg-white
                hover:bg-slate-100 hover:border-slate-400
                transition
              "
                        >
                            Cambiar usuario
                        </button>
                    </div>

                </div>
            </header>

            {/* Page Content */}
            <main className="flex-1">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
