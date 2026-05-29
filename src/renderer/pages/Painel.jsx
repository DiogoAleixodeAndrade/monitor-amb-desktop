export default function Painel() {
  return (
    <main className="painel-page">
      <section className="painel-header">
        <div className="painel-logo">
          <div className="mini-logo">+</div>
          <div>
            <strong>Monitor Amb</strong>
            <span>IECAC</span>
          </div>
        </div>

        <div className="painel-clock">Painel de chamada</div>
      </section>

      <section className="painel-current-call">
        <p>Paciente</p>
        <h1>AGUARDANDO CHAMADA</h1>

        <div className="painel-destination">
          <span>Setor</span>
          <strong>---</strong>
        </div>
      </section>

      <section className="painel-last-calls">
        <h2>Últimas chamadas</h2>

        <div className="last-call-row">
          <span>Nenhuma chamada registrada</span>
          <strong>---</strong>
        </div>
      </section>
    </main>
  );
}