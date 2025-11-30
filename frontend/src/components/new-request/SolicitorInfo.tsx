import type { User } from '../../types/user';

export function SolicitorInfo({ user }: { user: User }) {
  return (
    <div className="mb-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm">
      <div className="flex flex-col">
        <span className="text-[11px] text-slate-500">Solicitante actual</span>
        <span className="text-sm font-medium text-slate-900">{user.displayName}</span>
        <span className="text-[11px] text-slate-400">
          {user.username} · {user.role}
        </span>
      </div>
    </div>
  );
}
