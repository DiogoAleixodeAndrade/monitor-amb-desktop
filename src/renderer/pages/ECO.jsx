import AppShell from '../components/AppShell.jsx';
import QueueBoard from '../components/QueueBoard.jsx';
import { useQueue } from '../context/QueueContext.jsx';
import { filterQueueBySector } from '../utils/queueRules.js';

export default function ECO() {
  const { activeQueue } = useQueue();

  const patients = filterQueueBySector(activeQueue, 'ECO');

  return (
    <AppShell
      title="Sala de ECO"
      subtitle="Controle de pacientes pausados para ecocardiograma"
    >
      <QueueBoard
        title="Pacientes enviados para ECO"
        subtitle="Inicie o exame, marque como realizado e retorne o paciente para o mesmo médico."
        patients={patients}
        context="ECO"
      />
    </AppShell>
  );
}