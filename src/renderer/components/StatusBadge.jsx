const statusLabels = {
  AGUARDANDO: 'Aguardando',
  CHAMADO: 'Chamado',
  EM_ATENDIMENTO: 'Em atendimento',
  PAUSADO_ECO: 'Pausado ECO',
  AGUARDANDO_RETORNO_ECO: 'Retorno ECO',
  NAO_COMPARECEU: 'Não apareceu',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Cancelado'
};

export default function StatusBadge({ status }) {
  const label = statusLabels[status] || status;

  return (
    <span className={`status-badge status-${status?.toLowerCase()}`}>
      {label}
    </span>
  );
}