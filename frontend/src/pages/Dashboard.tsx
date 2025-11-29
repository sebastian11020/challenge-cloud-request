import { useUser } from "../context/UserContext";

export default function Dashboard() {
    const { currentUser } = useUser();

    if (!currentUser) return null;

    return (
        <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-700">
                Bienvenido, <span className="font-medium">{currentUser.displayName}</span>.
            </p>
            <p className="text-sm text-slate-600">
                Tu rol actual es{" "}
                <span className="font-mono text-xs px-2 py-1 bg-slate-100 rounded">
          {currentUser.role}
        </span>
                . Aquí luego adaptaremos el contenido según el rol.
            </p>
        </div>
    );
}
