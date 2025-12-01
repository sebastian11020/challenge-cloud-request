import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useHistory, type HistoryFilters } from '../hooks/useHistory';
import { HistoryFiltersBar } from '../components/history/HistoryFiltersBar';
import { HistoryTable } from '../components/history/HistoryTable';
import type { RequestHistoryAction } from '../types/history';

const initialFilters: HistoryFilters = {
  actorId: '',
  action: '',
  from: '',
  to: '',
};

export function HistoryPage() {
  const { currentUser } = useUser();
  const navigate = useNavigate();

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  const [filters, setFilters] = useState<HistoryFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<HistoryFilters>(initialFilters);

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { events, loading, error } = useHistory(appliedFilters);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: name === 'action' ? (value as '' | RequestHistoryAction) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilters(filters);
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRequestClick = (requestId: number) => {
    navigate(`/solicitudes/${requestId}`);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado de la página */}
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Historial de solicitudes
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Vista global de todas las acciones realizadas sobre las solicitudes: quién
            hizo qué, cuándo y con qué resultado.
          </p>
        </div>
        <div className="hidden flex-col items-end text-[11px] text-slate-400 sm:flex">
          <span className="font-medium text-slate-700">{currentUser.displayName}</span>
          <span>{currentUser.username} · Administrador</span>
        </div>
      </header>

      <HistoryFiltersBar
        filters={filters}
        loading={loading}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        onClear={handleClearFilters}
      />

      <HistoryTable
        events={events}
        loading={loading}
        error={error}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onRequestClick={handleRequestClick}
      />
    </div>
  );
}
