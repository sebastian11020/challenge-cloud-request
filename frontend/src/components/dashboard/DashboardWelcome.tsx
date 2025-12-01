import type { User } from '../../types/user';

interface DashboardWelcomeProps {
  user: User;
}

export function DashboardWelcome({ user }: DashboardWelcomeProps) {
  const firstName = user.displayName.split(' ')[0] ?? user.displayName;

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-200/50 via-white/70 to-white p-6 shadow-lg">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Hola, {firstName} 👋</h1>
          <p className="text-xs text-slate-500">
            Bienvenido al flujo de aprobaciones interno.
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-600">
        Tu rol actual es{' '}
        <span className="rounded bg-slate-800 px-2 py-1 font-mono text-xs text-white">
          {user.role.toLowerCase()}
        </span>
        .
      </p>
    </div>
  );
}
