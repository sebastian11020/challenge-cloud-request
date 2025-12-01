import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getInitials } from '../utils/GetInitials';
import { NavItem } from './NavItem';
import { usePendingApprovals } from '../hooks/usePendingApprovals';

const ROLE_LABELS: Record<string, string> = {
  SOLICITANTE: 'Solicitante',
  APROBADOR: 'Aprobador',
  ADMIN: 'Administrador',
};

export function Layout() {
  const { currentUser, setCurrentUser } = useUser();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const isSolicitante = currentUser.role === 'SOLICITANTE';
  const isAprobador = currentUser.role === 'APROBADOR';
  const isAdmin = currentUser.role === 'ADMIN';

  const pendingCount = usePendingApprovals(isAprobador ? currentUser.id : undefined);

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.18),transparent_70%)] from-slate-100 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm">
              FA
            </div>
            <div className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-semibold text-slate-900">
                Flujo de Aprobaciones
              </span>
              <span className="text-[11px] text-slate-500">
                Banco · Centro de Excelencia
              </span>
            </div>
          </div>

          {/* NAVBAR CENTRADO */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <NavItem to="/dashboard">Dashboard</NavItem>

            {isSolicitante && (
              <>
                <NavItem to="/solicitudes">Mis solicitudes</NavItem>
                <NavItem to="/solicitudes/nueva">Nueva solicitud</NavItem>
              </>
            )}

            {isAprobador && (
              <NavItem to="/aprobaciones">
                <span className="relative inline-flex items-center gap-2">
                  <span>Bandeja de aprobación</span>

                  {pendingCount > 0 && (
                    <span className="flex h-[18px] min-w-[18px] animate-pulse items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm">
                      {pendingCount}
                    </span>
                  )}
                </span>
              </NavItem>
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
            <div className="hidden flex-col text-right text-sm leading-tight sm:flex">
              <span className="font-medium text-slate-900">
                {currentUser.displayName}
              </span>
              <span className="text-[11px] text-slate-500">
                {currentUser.username} · {ROLE_LABELS[currentUser.role]}
              </span>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white shadow-sm">
              {getInitials(currentUser.displayName)}
            </div>

            <button
              onClick={handleLogout}
              className="hidden rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium transition hover:border-slate-400 hover:bg-slate-100 sm:inline-flex"
            >
              Cambiar usuario
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
