import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-semibold text-slate-900 mb-2">404</h1>
            <p className="text-sm text-slate-600 mb-4">
                La página que buscas no existe.
            </p>
            <Link
                to="/"
                className="inline-flex items-center px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
            >
                Volver al inicio
            </Link>
        </div>
    );
}
