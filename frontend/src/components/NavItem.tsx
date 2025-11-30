import { NavLink } from 'react-router-dom';

export function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-1.5 py-1 font-medium transition-all ${
          isActive
            ? 'text-slate-900 underline decoration-sky-400 underline-offset-4'
            : 'text-slate-600 hover:text-slate-900 hover:decoration-sky-300'
        } `
      }
    >
      {children}
    </NavLink>
  );
}
