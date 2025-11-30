import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mb-2 text-3xl font-semibold text-slate-900">404</h1>
      <p className="mb-4 text-sm text-slate-600">La página que buscas no existe.</p>
      <Link
        to="/"
        className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
