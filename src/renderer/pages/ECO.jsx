import AppShell from '../components/AppShell.jsx';
import QueueBoard from '../components/QueueBoard.jsx';
import { mockQueue } from '../data/mockQueue.js';
import { filterQueueBySector } from '../utils/queueRules.js';

export default function ECO() {
  const patients = filterQueueBySector(mockQueue, 'ECO');

  return (
    <AppShell
      title="Sala de ECO"
      subtitle="Controle de pacientes pausados para ecocardiograma"
    >
      <QueueBoard
        title="Pacientes enviados para ECO"
        subtitle="Controle de exame em andamento, realizado e retorno ao médico."
        patients={patients}
      />
    </AppShell>
  );
}