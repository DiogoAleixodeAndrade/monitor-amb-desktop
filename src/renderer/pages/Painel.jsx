import { useEffect, useState } from 'react';

import { useQueue } from '../context/QueueContext.jsx';
import { formatPanelTime, getPanelSectorLabel } from '../utils/panelUtils.js';

export default function Painel() {
  const { currentCall, callQueue, lastCalls } = useQueue();
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hasCurrentCall = Boolean(currentCall);

  return (
    <main className="painel-page">
      <section className="painel-header">
        <div className="painel-logo">
          <div className="mini-logo">+</div>

          <div>
            <strong>Monitor Amb</strong>
            <span>Ambulatório IECAC</span>
          </div>
        </div>

        <div className="painel-clock">
          {new Intl.DateTimeFormat('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).format(clock)}
        </div>
      </section>

      <section
        className={`painel-current-call ${
          hasCurrentCall ? 'painel-has-call' : ''
        }`}
      >
        <div className="call-label">
          {hasCurrentCall ? 'Paciente chamado' : 'Aguardando chamada'}
        </div>

        <h1>
          {hasCurrentCall
            ? currentCall.nomePaciente
            : 'AGUARDANDO CHAMADA'}
        </h1>

        <div className="painel-destination-grid">
          <div className="painel-destination">
            <span>Destino</span>
            <strong>
              {hasCurrentCall ? currentCall.destino : '---'}
            </strong>
          </div>

          <div className="painel-destination">
            <span>Setor</span>
            <strong>
              {hasCurrentCall
                ? getPanelSectorLabel(currentCall.setorAtual)
                : '---'}
            </strong>
          </div>

          <div className="painel-destination">
            <span>Horário</span>
            <strong>
              {hasCurrentCall
                ? formatPanelTime(currentCall.dataHoraChamada)
                : '--:--'}
            </strong>
          </div>
        </div>

        {callQueue.length > 0 && (
          <div className="painel-waiting-calls">
            {callQueue.length} chamada(s) na fila
          </div>
        )}
      </section>

      <section className="painel-last-calls">
        <div className="last-calls-header">
          <h2>Últimas chamadas</h2>
          <span>Histórico recente do painel</span>
        </div>

        <div className="last-calls-grid">
          {lastCalls.length === 0 ? (
            <div className="last-call-row empty">
              <span>Nenhuma chamada registrada</span>
              <strong>---</strong>
            </div>
          ) : (
            lastCalls.map((call) => (
              <div className="last-call-row" key={call.idChamada}>
                <div>
                  <strong>{call.nomePaciente}</strong>
                  <span>{call.destino}</span>
                </div>

                <time>{formatPanelTime(call.dataHoraChamada)}</time>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}