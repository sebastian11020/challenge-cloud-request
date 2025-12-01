import type { User } from '../../types/user';

export function RequestListHeader({ user }: { user: User }) {
  return (
    <header className="mb-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Mis solicitudes</h1>
        <p className="text-xs text-slate-500">Historial de solicitudes creadas por ti.</p>
      </div>

      <div className="text-right leading-tight">
        <p className="text-xs font-medium text-slate-600">{user.displayName}</p>
        <p className="text-[11px] text-slate-400">
          {user.username} · {user.role}
        </p>
      </div>
    </header>
  );
}
