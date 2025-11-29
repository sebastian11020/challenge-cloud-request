import { NavLink } from "react-router-dom";

export function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => `
        transition-all font-medium
        px-1.5 py-1

        ${
                isActive
                    ? "text-slate-900 underline underline-offset-4 decoration-sky-400"
                    : "text-slate-600 hover:text-slate-900 hover:decoration-sky-300"
            }
      `}
        >
            {children}
        </NavLink>
    );
}
