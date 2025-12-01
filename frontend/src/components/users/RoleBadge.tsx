import type { User } from '../../types/user';

type RoleValue = User['role'] | string;

const ROLE_STYLES: Record<string, { label: string; classes: string }> = {
  SOLICITANTE: {
    label: 'solicitante',
    classes: 'bg-sky-100 text-sky-800 ring-sky-200',
  },
  APROBADOR: {
    label: 'aprobador',
    classes: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  },
  ADMIN: {
    label: 'administrador',
    classes: 'bg-amber-100 text-amber-800 ring-amber-200',
  },
};

interface RoleBadgeProps {
  role: RoleValue;
  size?: 'sm' | 'md';
}

export function RoleBadge({ role, size = 'sm' }: RoleBadgeProps) {
  const key = String(role).toUpperCase();
  const config = ROLE_STYLES[key] ?? {
    label: String(role),
    classes: 'bg-slate-100 text-slate-700 ring-slate-200',
  };

  const sizeClasses = size === 'md' ? 'text-[11px] px-3 py-1' : 'text-[10px] px-2 py-0.5';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ring-1 ${config.classes} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
}
