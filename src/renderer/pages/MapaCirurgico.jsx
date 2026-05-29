import AppShell from '../components/AppShell.jsx';

export default function MapaCirurgico() {
  return (
    <AppShell
      title="Sala de Mapa Cirúrgico"
      subtitle="Controle dos pacientes encaminhados para programação cirúrgica"
    >
      <div className="module-card">
        <p className="eyebrow">Mapa cirúrgico</p>

        <h2>Pacientes aguardando mapa cirúrgico</h2>

        <p>
          Aqui vamos montar a fila exclusiva da sala de mapa cirúrgico, com
          chamada do paciente, confirmação de presença, ausência, check-out e
          encaminhamento para outros setores quando necessário.
        </p>

        <div className="rule-box">
          <strong>Regra do setor</strong>
          <span>
            A sala de mapa cirúrgico só visualizará pacientes encaminhados para
            MAPA_CIRURGICO. Outros setores não aparecem para este perfil.
          </span>
        </div>
      </div>
    </AppShell>
  );
}