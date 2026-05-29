import AppShell from '../components/AppShell.jsx';
import QueueBoard from '../components/QueueBoard.jsx';
import { mockQueue } from '../data/mockQueue.js';
import { filterQueueBySector } from '../utils/queueRules.js';

export default function Medicacao() {
  const patients = filterQueueBySector(mockQueue, 'MEDICACAO');

  return (
    <AppShell
      title="Sala de Medicação"
      subtitle="Fila de pacientes encaminhados para medicação"
    >
      <QueueBoard
        title="Pacientes aguardando medicação"
        subtitle="Fila exclusiva da sala de medicação."
        patients={patients}
      />
    </AppShell>
  );
}