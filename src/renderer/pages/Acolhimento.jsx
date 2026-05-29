import AppShell from '../components/AppShell.jsx';
import QueueBoard from '../components/QueueBoard.jsx';
import { useQueue } from '../context/QueueContext.jsx';
import { filterQueueBySector } from '../utils/queueRules.js';

export default function Acolhimento() {
  const { activeQueue } = useQueue();

  const patients = filterQueueBySector(activeQueue, 'ACOLHIMENTO');

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