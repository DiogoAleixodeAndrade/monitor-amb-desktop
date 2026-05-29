import { useMemo, useState } from 'react';

import { dashboardSectorLabels } from '../utils/dashboardAnalytics.js';
import {
  buildAttendanceExportRows,
  exportRowsToCsv,
  generateReportFilename
} from '../utils/exportUtils.js';
import { formatDateTime } from '../utils/queueRules.js';
import StatusBadge from './StatusBadge.jsx';

const statusLabels = {
  AGUARDANDO: 'Aguardando',
  CHAMADO: 'Chamado',
  EM_ATENDIMENTO: 'Em atendimento',
  PAUSADO_ECO: 'Pausado ECO',
  AGUARDANDO_RETORNO_ECO: 'Retorno ECO',
  NAO_COMPARECEU: 'Não apareceu',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Cancelado'
};

export default function ReportTable({ data }) {
  const [search, setSearch] = useState('');
  const [exportFeedback, setExportFeedback] = useState('');

  const filteredRows = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const orderedData = [...data].sort((a, b) => {
      const dateA = new Date(a.dataHoraEntrada || 0).getTime();
      const dateB = new Date(b.dataHoraEntrada || 0).getTime();

      return dateB - dateA;
    });

    if (!normalizedSearch) {
      return orderedData;
    }

    return orderedData.filter((item) => {
      const searchableText = [
        item.nomePaciente,
        item.nomeSocial,
        item.nomeMedicoDestino,
        item.setorAtual,
        dashboardSectorLabels[item.setorAtual],
        item.statusAtendimento,
        statusLabels[item.statusAtendimento],
        item.especialidade,
        item.cns,
        item.prontuario
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [data, search]);

  const finishedCount = filteredRows.filter(
    (item) => item.statusAtendimento === 'FINALIZADO'
  ).length;

  const inProgressCount = filteredRows.filter(
    (item) => item.statusAtendimento === 'EM_ATENDIMENTO'
  ).length;

  const missingCount = filteredRows.filter(
    (item) => item.statusAtendimento === 'NAO_COMPARECEU'
  ).length;

  function handleExportClick() {
    setExportFeedback('');

    const rows = buildAttendanceExportRows(filteredRows);

    const result = exportRowsToCsv(
      rows,
      generateReportFilename('relatorio-atendimentos-monitor-amb')
    );

    setExportFeedback(result.message);
  }

  return (
    <section className="report-card">
      <header className="report-header">
        <div>
          <p className="eyebrow">Relatório operacional</p>
          <h2>Atendimentos detalhados</h2>
          <span>
            Consulte pacientes, setores, médicos, horários, status e prioridades.
          </span>
        </div>

        <button className="report-export-button" onClick={handleExportClick}>
          Exportar CSV
        </button>
      </header>

      {exportFeedback && (
        <div className="report-export-feedback">{exportFeedback}</div>
      )}

      <div className="report-toolbar">
        <label className="field report-search">
          <span>Buscar no relatório</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por paciente, médico, CNS, setor ou status..."
          />
        </label>

        <div className="report-mini-stats">
          <div>
            <span>Registros</span>
            <strong>{filteredRows.length}</strong>
          </div>

          <div>
            <span>Finalizados</span>
            <strong>{finishedCount}</strong>
          </div>

          <div>
            <span>Em atendimento</span>
            <strong>{inProgressCount}</strong>
          </div>

          <div>
            <span>Ausentes</span>
            <strong>{missingCount}</strong>
          </div>
        </div>
      </div>

      <div className="report-table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>CNS</th>
              <th>Setor</th>
              <th>Médico</th>
              <th>Entrada</th>
              <th>Presença</th>
              <th>Check-out</th>
              <th>Status</th>
              <th>Prioridade</th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan="9">
                  <div className="report-empty">
                    Nenhum atendimento encontrado com os filtros atuais.
                  </div>
                </td>
              </tr>
            ) : (
              filteredRows.map((item) => (
                <tr key={item.idAtendimento || item.idFila}>
                  <td>
                    <div className="patient-cell">
                      <strong>{item.nomeSocial || item.nomePaciente}</strong>
                      <span>{item.prontuario || 'Sem prontuário'}</span>
                    </div>
                  </td>

                  <td>{item.cns || '-'}</td>

                  <td>
                    {dashboardSectorLabels[item.setorAtual] || item.setorAtual}
                  </td>

                  <td>{item.nomeMedicoDestino || '-'}</td>

                  <td>{formatDateTime(item.dataHoraEntrada)}</td>

                  <td>{formatDateTime(item.dataHoraApareceu)}</td>

                  <td>{formatDateTime(item.dataHoraCheckout)}</td>

                  <td>
                    <StatusBadge status={item.statusAtendimento} />
                  </td>

                  <td>
                    {item.prioritario ? (
                      <span className="report-priority">
                        {item.tipoPrioridade || 'Prioridade'}
                      </span>
                    ) : item.retornoExame ? (
                      <span className="report-eco">Retorno ECO</span>
                    ) : (
                      <span className="report-normal">Normal</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}