import { useParams } from "react-router-dom";

export default function DetailRequest() {
    const { id } = useParams();

    return (
        <div>
            <h1 className="text-xl font-semibold text-slate-900 mb-2">
                Detalle de solicitud
            </h1>
            <p className="text-sm text-slate-700 mb-1">
                ID: <span className="font-mono">{id}</span>
            </p>
            <p className="text-sm text-slate-600">
                Aquí mostraremos toda la información de la solicitud y su histórico.
            </p>
        </div>
    );
}
