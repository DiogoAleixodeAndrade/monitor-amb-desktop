import AppShell from '../components/AppShell.jsx';
import QueueBoard from '../components/QueueBoard.jsx';
import { useQueue } from '../context/QueueContext.jsx';
import { filterQueueBySector } from '../utils/queueRules.js';

export default function MapaCirurgico() {
  const { queue } = useQueue();

  const patients = filterQueueBySector(queue, 'MAPA_CIRURGICO');

  return (
    <AppShell
      title="Sala de Mapa Cirúrgico"
      subtitle="Controle dos pacientes encaminhados para programação cirúrgica"
    >
      <QueueBoard
        title="Pacientes aguardando mapa cirúrgico"
        subtitle="Fila exclusiva da sala de mapa cirúrgico."
        patients={patients}
      />
    </AppShell>
  );
}