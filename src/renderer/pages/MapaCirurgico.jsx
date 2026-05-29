import AppShell from '../components/AppShell.jsx';
import QueueBoard from '../components/QueueBoard.jsx';
import { mockQueue } from '../data/mockQueue.js';
import { filterQueueBySector } from '../utils/queueRules.js';

export default function MapaCirurgico() {
  const patients = filterQueueBySector(mockQueue, 'MAPA_CIRURGICO');

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