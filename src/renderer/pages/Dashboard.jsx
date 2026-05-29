import { useMemo, useState } from 'react';

import AppShell from '../components/AppShell.jsx';
import BarChart from '../components/BarChart.jsx';
import DonutChart from '../components/DonutChart.jsx';
import StatCard from '../components/StatCard.jsx';
import { useQueue } from '../context/QueueContext.jsx';
import { mockAnalyticsHistory } from '../data/mockAnalyticsHistory.js';
import {
  dashboardSectorLabels,
  filterDashboardData,
  getDashboardMetrics,
  getUniqueDoctors,
  groupAverageTimeBy,
  groupCountBy
} from '../utils/dashboardAnalytics.js';

export default function Dashboard() {
  const { queue } = useQueue();

  const [filters, setFilters] = useState({
    period: 'MONTH',
    sector: 'ALL',
    doctor: 'ALL'
  });

  const allDashboardData = useMemo(() => {
    return [...mockAnalyticsHistory, ...queue];
  }, [queue]);

  const doctors = useMemo(() => {
    return getUniqueDoctors(allDashboardData);
  }, [allDashboardData]);

  const filteredData = useMemo(() => {
    return filterDashboardData(allDashboardData, filters);
  }, [allDashboardData, filters]);

  const metrics = useMemo(() => {
    return getDashboardMetrics(filteredData);
  }, [filteredData]);

  const countBySector = useMemo(() => {
    return groupCountBy(filteredData, 'setorAtual', dashboardSectorLabels);
  }, [filteredData]);

  const countByStatus = useMemo(() => {
    return groupCountBy(filteredData, 'statusAtendimento', {
      AGUARDANDO: 'Aguardando',
      CHAMADO: 'Chamado',
      EM_ATENDIMENTO: 'Em atendimento',
      PAUSADO_ECO: 'Pausado ECO',
      AGUARDANDO_RETORNO_ECO: 'Retorno ECO',
      NAO_COMPARECEU: 'Não apareceu',
      FINALIZADO: 'Finalizado',
      CANCELADO: 'Cancelado'
    });
  }, [filteredData]);

  const avgBySector = useMemo(() => {
    return groupAverageTimeBy(filteredData, 'setorAtual', dashboardSectorLabels);
  }, [filteredData]);

  const avgByDoctor = useMemo(() => {
    return groupAverageTimeBy(filteredData, 'nomeMedicoDestino');
  }, [filteredData]);

  function updateFilter(field, value) {
    setFilters((current) => ({
      ...current,
      [field]: value
    }));
  }

  return (
    <AppShell
      title="Dashboard"
      subtitle="Indicadores operacionais do ambulatório em tempo real"
    >
      <section className="dashboard-filters">
        <div>
          <p className="eyebrow">Filtros</p>
          <h2>Visão dos indicadores</h2>
        </div>

        <div className="dashboard-filter-grid">
          <label className="field">
            <span>Período</span>
            <select
              value={filters.period}
              onChange={(event) => updateFilter('period', event.target.value)}
            >
              <option value="TODAY">Hoje</option>
              <option value="MONTH">Mês atual</option>
              <option value="ALL">Todos os dados</option>
            </select>
          </label>

          <label className="field">
            <span>Setor</span>
            <select
              value={filters.sector}
              onChange={(event) => updateFilter('sector', event.target.value)}
            >
              <option value="ALL">Todos os setores</option>
              <option value="ACOLHIMENTO">Acolhimento</option>
              <option value="MEDICO">Médico</option>
              <option value="ECG">Sala de E.C.G.</option>
              <option value="MEDICACAO">Medicação</option>
              <option value="CURATIVO">Curativo</option>
              <option value="ECO">ECO</option>
              <option value="MAPA_CIRURGICO">Mapa 24h</option>
            </select>
          </label>

          <label className="field">
            <span>Médico</span>
            <select
              value={filters.doctor}
              onChange={(event) => updateFilter('doctor', event.target.value)}
            >
              <option value="ALL">Todos os médicos</option>

              {doctors.map((doctor) => (
                <option key={doctor.value} value={doctor.value}>
                  {doctor.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="dashboard-stats-grid">
        <StatCard
          label="Pacientes hoje"
          value={metrics.patientsToday}
          description="Entradas registradas no dia"
          tone="blue"
        />

        <StatCard
          label="Consultas no mês"
          value={metrics.consultationsMonth}
          description="Total detalhado no período mensal"
          tone="red"
        />

        <StatCard
          label="Aguardando"
          value={metrics.waiting}
          description="Pacientes ainda na fila"
          tone="blue"
        />

        <StatCard
          label="Em atendimento"
          value={metrics.inProgress}
          description="Pacientes com presença confirmada"
          tone="green"
        />

        <StatCard
          label="Prioridades"
          value={metrics.priority}
          description="Cadeirante, idoso, pós-operatório etc."
          tone="red"
        />

        <StatCard
          label="Ausentes"
          value={metrics.missing}
          description="Pacientes que não apareceram"
          tone="yellow"
        />

        <StatCard
          label="Fluxo ECO"
          value={metrics.eco}
          description="Pausas, exames e retornos ECO"
          tone="purple"
        />

        <StatCard
          label="Mapa 24h"
          value={metrics.mapa24h}
          description="Pacientes do setor Mapa 24h"
          tone="dark"
        />
      </section>

      <section className="dashboard-charts-grid">
        <BarChart
          title="Consultas por setor"
          subtitle="Quantidade total de atendimentos por área"
          data={countBySector}
        />

        <BarChart
          title="Tempo médio por setor"
          subtitle="Média em minutos entre presença e finalização"
          data={avgBySector}
          suffix=" min"
        />

        <BarChart
          title="Tempo médio por médico"
          subtitle="Média em minutos por profissional"
          data={avgByDoctor}
          suffix=" min"
        />

        <DonutChart
          title="Status dos atendimentos"
          subtitle="Distribuição geral da fila e histórico"
          items={countByStatus}
        />
      </section>
    </AppShell>
  );
}