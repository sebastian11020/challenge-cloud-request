import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  helperText?: string;
  percentage?: number; // 0 - 100
  variant?: 'primary' | 'warning' | 'success' | 'danger';
}

const VARIANT_STYLES: Record<
  NonNullable<StatCardProps['variant']>,
  { badge: string; ring: string }
> = {
  primary: {
    badge: 'bg-sky-100 text-sky-700 border-sky-200',
    ring: 'ring-sky-100',
  },
  warning: {
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    ring: 'ring-amber-100',
  },
  success: {
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    ring: 'ring-emerald-100',
  },
  danger: {
    badge: 'bg-rose-100 text-rose-700 border-rose-200',
    ring: 'ring-rose-100',
  },
};

export function StatCard({
  title,
  value,
  icon,
  helperText,
  percentage,
  variant = 'primary',
}: StatCardProps) {
  const styles = VARIANT_STYLES[variant];

  // Aseguramos que el porcentaje esté entre 0 y 100
  const safePercentage =
    typeof percentage === 'number' ? Math.max(0, Math.min(100, percentage)) : undefined;

  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm ring-1 ${styles.ring} `}
    >
      {/* Header: icono + título */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              {icon}
            </div>
          )}

          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${styles.badge} `}
          >
            {title}
          </span>
        </div>

        {safePercentage !== undefined && (
          <span className="text-[11px] font-medium text-slate-500">
            {safePercentage}% del total
          </span>
        )}
      </div>

      {/* Valor principal */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-semibold leading-none text-slate-800">
          {value}
        </span>
      </div>

      {/* Texto auxiliar */}
      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}

      {/* Barra de progreso opcional */}
      {safePercentage !== undefined && (
        <div className="mt-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${
                variant === 'warning'
                  ? 'bg-amber-400'
                  : variant === 'success'
                    ? 'bg-emerald-500'
                    : variant === 'danger'
                      ? 'bg-rose-500'
                      : 'bg-sky-500'
              } `}
              style={{ width: `${safePercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
