import AppShell from '../components/AppShell.jsx';
import QueueBoard from '../components/QueueBoard.jsx';
import { mockQueue } from '../data/mockQueue.js';
import { filterQueueBySector } from '../utils/queueRules.js';

export default function ECG() {
  const patients = filterQueueBySector(mockQueue, 'ECG');

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