import AppShell from '../components/AppShell.jsx';
import QueueBoard from '../components/QueueBoard.jsx';
import { useQueue } from '../context/QueueContext.jsx';
import { filterQueueBySector } from '../utils/queueRules.js';

export default function MapaCirurgico() {
  const { activeQueue } = useQueue();

  const patients = filterQueueBySector(activeQueue, 'MAPA_CIRURGICO');

  return (
    <AppShell
      title="Mapa 24h"
      subtitle="Controle dos pacientes encaminhados para a sala de Mapa 24h"
    >
      <QueueBoard
        title="Pacientes aguardando Mapa 24h"
        subtitle="Fila exclusiva do setor de Mapa 24h."
        patients={patients}
      />
    </AppShell>
  );
}