import AppShell from '../components/AppShell.jsx';
import QueueBoard from '../components/QueueBoard.jsx';
import { useQueue } from '../context/QueueContext.jsx';
import { filterQueueBySector } from '../utils/queueRules.js';

export default function Curativo() {
  const { queue } = useQueue();

  const patients = filterQueueBySector(queue, 'CURATIVO');

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
}