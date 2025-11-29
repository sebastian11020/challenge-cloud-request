import type { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: number | string;
    icon?: ReactNode;
    helperText?: string;
    percentage?: number; // 0 - 100
    variant?: "primary" | "warning" | "success" | "danger";
}

const VARIANT_STYLES: Record<
    NonNullable<StatCardProps["variant"]>,
    { badge: string; ring: string }
> = {
    primary: {
        badge: "bg-sky-100 text-sky-700 border-sky-200",
        ring: "ring-sky-100",
    },
    warning: {
        badge: "bg-amber-100 text-amber-700 border-amber-200",
        ring: "ring-amber-100",
    },
    success: {
        badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
        ring: "ring-emerald-100",
    },
    danger: {
        badge: "bg-rose-100 text-rose-700 border-rose-200",
        ring: "ring-rose-100",
    },
};

export function StatCard({
                             title,
                             value,
                             icon,
                             helperText,
                             percentage,
                             variant = "primary",
                         }: StatCardProps) {
    const styles = VARIANT_STYLES[variant];

    // Aseguramos que el porcentaje esté entre 0 y 100
    const safePercentage =
        typeof percentage === "number"
            ? Math.max(0, Math.min(100, percentage))
            : undefined;

    return (
        <div
            className={`
        rounded-xl p-4 border border-slate-200 bg-white shadow-sm 
        flex flex-col gap-3 ring-1 ${styles.ring}
      `}
        >
            {/* Header: icono + título */}
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    {icon && (
                        <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                            {icon}
                        </div>
                    )}

                    <span
                        className={`
              inline-flex items-center px-2 py-0.5 rounded-full 
              text-[11px] border font-medium ${styles.badge}
            `}
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
        <span className="text-3xl font-semibold text-slate-800 leading-none">
          {value}
        </span>
            </div>

            {/* Texto auxiliar */}
            {helperText && (
                <p className="text-xs text-slate-500">
                    {helperText}
                </p>
            )}

            {/* Barra de progreso opcional */}
            {safePercentage !== undefined && (
                <div className="mt-1">
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                            className={`
                h-full rounded-full 
                ${
                                variant === "warning"
                                    ? "bg-amber-400"
                                    : variant === "success"
                                        ? "bg-emerald-500"
                                        : variant === "danger"
                                            ? "bg-rose-500"
                                            : "bg-sky-500"
                            }
              `}
                            style={{ width: `${safePercentage}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
