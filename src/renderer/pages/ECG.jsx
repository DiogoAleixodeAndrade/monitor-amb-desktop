import AppShell from '../components/AppShell.jsx';
import QueueBoard from '../components/QueueBoard.jsx';
import { useQueue } from '../context/QueueContext.jsx';
import { filterQueueBySector } from '../utils/queueRules.js';

export default function ECG() {
  const { queue } = useQueue();

  const patients = filterQueueBySector(queue, 'ECG');

  return (
    <AppShell title="Sala de E.C.G." subtitle="Fila da sala de eletrocardiograma">
      <QueueBoard
        title="Pacientes aguardando E.C.G."
        subtitle="Fila exclusiva da sala de eletrocardiograma."
        patients={patients}
      />
    </AppShell>
  );
}