import AppShell from '../components/AppShell.jsx';
import QueueBoard from '../components/QueueBoard.jsx';
import { mockQueue } from '../data/mockQueue.js';
import { filterQueueBySector } from '../utils/queueRules.js';

export default function Curativo() {
  const patients = filterQueueBySector(mockQueue, 'CURATIVO');

  return (
    <AppShell
      title="Sala de Curativo"
      subtitle="Fila de pacientes encaminhados para curativo"
    >
      <QueueBoard
        title="Pacientes aguardando curativo"
        subtitle="Fila exclusiva da sala de curativo."
        patients={patients}
      />
    </AppShell>
  );
}code src/renderer/pages/ECO.jsx