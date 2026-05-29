import AppShell from '../components/AppShell.jsx';
import QueueBoard from '../components/QueueBoard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useQueue } from '../context/QueueContext.jsx';
import { filterMedicalQueue } from '../utils/queueRules.js';

export default function Medico() {
  const { user } = useAuth();
  const { queue } = useQueue();

  const medicoId = user?.medicoVinculado?.id;
  const patients = filterMedicalQueue(queue, medicoId);

  return (
    <AppShell title="Médico" subtitle="Fila individual do profissional logado">
      <QueueBoard
        title={user?.medicoVinculado?.nome || user?.nome}
        subtitle="O médico visualiza apenas os pacientes destinados a ele."
        patients={patients}
      />
    </AppShell>
  );
}