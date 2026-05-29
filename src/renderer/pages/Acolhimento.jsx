import AppShell from '../components/AppShell.jsx';
import QueueBoard from '../components/QueueBoard.jsx';
import { mockQueue } from '../data/mockQueue.js';
import { filterQueueBySector } from '../utils/queueRules.js';

export default function Acolhimento() {
  const patients = filterQueueBySector(mockQueue, 'ACOLHIMENTO');

  return (
    <AppShell
      title="Acolhimento"
      subtitle="Fila de pacientes aguardando classificação/encaminhamento"
    >
      <QueueBoard
        title="Pacientes no acolhimento"
        subtitle="Prioridades aparecem primeiro na fila."
        patients={patients}
      />
    </AppShell>
  );
}