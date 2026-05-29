import AppShell from '../components/AppShell.jsx';
import QueueBoard from '../components/QueueBoard.jsx';
import { useQueue } from '../context/QueueContext.jsx';
import { filterQueueBySector } from '../utils/queueRules.js';

export default function Medicacao() {
  const { activeQueue } = useQueue();

  const patients = filterQueueBySector(activeQueue, 'MEDICACAO');

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