export default function PriorityBadge({ patient }) {
  if (patient.retornoExame) {
    return <span className="priority-badge eco">Retorno {patient.tipoExame}</span>;
  }

  if (!patient.prioritario) {
    return <span className="priority-badge normal">Normal</span>;
  }

  return (
    <span className="priority-badge priority">
      Prioridade: {patient.tipoPrioridade}
    </span>
  );
}