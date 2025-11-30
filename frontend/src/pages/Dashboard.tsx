import { useUser } from '../context/UserContext';
import { DashboardWelcome } from '../components/dashboard/DashboardWelcome';
import { StatCard } from '../components/dashboard/StatCard';
import { useRequestStats, type RequestStatsParams } from '../hooks/useRequestStats';
import { FilePlus, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function Dashboard() {
  const { currentUser } = useUser();
  if (!currentUser) return null;

  const isSolicitante = currentUser.role === 'SOLICITANTE';
  const isAprobador = currentUser.role === 'APROBADOR';
  const isAdmin = currentUser.role === 'ADMIN';

  const statsParams: RequestStatsParams | undefined = isAdmin
    ? {}
    : isSolicitante
      ? { applicantId: currentUser.id }
      : isAprobador
        ? { responsibleId: currentUser.id }
        : {};

  const { stats, loading, error } = useRequestStats(statsParams);

  const createdLabel = isAprobador ? 'Solicitudes asignadas' : 'Solicitudes creadas';

  const scopeLabel = isAdmin
    ? 'Aquí verás el resumen global de todas las solicitudes del sistema.'
    : isSolicitante
      ? 'Aquí verás el resumen de las solicitudes que has creado.'
      : 'Aquí verás el resumen de las solicitudes asignadas a ti como responsable.';

  if (!stats) return null;

  const total = stats.total || 0;
  const pendingPercent = total > 0 ? Math.round((stats.pending / total) * 100) : 0;
  const approvedPercent = total > 0 ? Math.round((stats.approved / total) * 100) : 0;
  const rejectedPercent = total > 0 ? Math.round((stats.rejected / total) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Bienvenida */}
      <DashboardWelcome user={currentUser} />

      {/* Descripción contexto */}
      <p className="text-xs text-slate-500">{scopeLabel}</p>

      {/* Resumen */}
      <section>
        <h2 className="mb-3 text-lg font-medium text-slate-800">Resumen</h2>

        {loading && <p className="text-sm text-slate-500">Cargando estadísticas...</p>}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {stats && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            {/* Total creadas / asignadas */}
            <StatCard
              title={createdLabel}
              value={stats.total}
              icon={<FilePlus size={18} />}
              helperText="Total de solicitudes registradas."
              variant="primary"
            />

            {/* Pendientes */}
            <StatCard
              title="Pendientes"
              value={stats.pending}
              icon={<Clock size={18} />}
              helperText="Solicitudes que esperan aprobación."
              percentage={pendingPercent}
              variant="warning"
            />

            {/* Aprobadas */}
            <StatCard
              title="Aprobadas"
              value={stats.approved}
              icon={<CheckCircle size={18} />}
              helperText="Solicitudes aprobadas exitosamente."
              percentage={approvedPercent}
              variant="success"
            />

            {/* Rechazadas */}
            <StatCard
              title="Rechazadas"
              value={stats.rejected}
              icon={<XCircle size={18} />}
              helperText="Solicitudes que fueron rechazadas."
              percentage={rejectedPercent}
              variant="danger"
            />
          </div>
        )}
      </section>
    </div>
  );
}
