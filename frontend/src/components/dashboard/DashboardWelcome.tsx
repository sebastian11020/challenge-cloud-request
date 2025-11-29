import type { User } from "../../types/user";

interface DashboardWelcomeProps {
    user: User;
}

export function DashboardWelcome({ user }: DashboardWelcomeProps) {
    const firstName = user.displayName.split(" ")[0] ?? user.displayName;

    return (
        <div className="
      rounded-2xl bg-gradient-to-br from-sky-200/50 via-white/70 to-white
      border border-slate-200 shadow-lg p-6 flex flex-col gap-2
    ">
            <div className="flex items-center gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">
                        Hola, {firstName} 👋
                    </h1>
                    <p className="text-xs text-slate-500">
                        Bienvenido al flujo de aprobaciones interno.
                    </p>
                </div>
            </div>

            <p className="text-sm text-slate-600">
                Tu rol actual es{" "}
                <span className="px-2 py-1 text-xs rounded bg-slate-800 text-white font-mono">
          {user.role.toLowerCase()}
        </span>.
            </p>
        </div>
    );
}
