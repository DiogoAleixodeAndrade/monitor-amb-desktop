import { useMemo, useState } from 'react';

import Button from './Button.jsx';
import Modal from './Modal.jsx';
import { getForwardOptionsBySector, sectorLabels } from '../data/forwardRules.js';

export default function ForwardPatientModal({
  open,
  patient,
  onClose,
  onConfirm
}) {
  const [selectedSector, setSelectedSector] = useState('');
  const [observation, setObservation] = useState('');

  const options = useMemo(() => {
    if (!patient) return [];

    return getForwardOptionsBySector(patient.setorAtual);
  }, [patient]);

  function handleClose() {
    setSelectedSector('');
    setObservation('');
    onClose();
  }

  function handleConfirm() {
    if (!selectedSector) {
      return;
    }

    onConfirm({
      patient,
      setorDestino: selectedSector,
      observacao: observation
    });

    setSelectedSector('');
    setObservation('');
  }

  const patientName = patient?.nomeSocial || patient?.nomePaciente || '-';

  return (
    <Modal
      open={open}
      title="Encaminhar paciente"
      subtitle="Selecione o próximo destino do atendimento."
      onClose={handleClose}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>

          <Button onClick={handleConfirm} disabled={!selectedSector}>
            Confirmar encaminhamento
          </Button>
        </>
      }
    >
      <div className="forward-summary">
        <div>
          <span>Paciente</span>
          <strong>{patientName}</strong>
        </div>

        <div>
          <span>Setor atual</span>
          <strong>{sectorLabels[patient?.setorAtual] || patient?.setorAtual}</strong>
        </div>

        <div>
          <span>Médico destino</span>
          <strong>{patient?.nomeMedicoDestino || '-'}</strong>
        </div>
      </div>

      <div className="forward-options">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={
              selectedSector === option.value
                ? 'forward-option selected'
                : 'forward-option'
            }
            onClick={() => setSelectedSector(option.value)}
          >
            <span>{option.label}</span>
            <small>
              {option.value === 'FINALIZAR'
                ? 'Encerrar o fluxo do paciente'
                : 'Enviar para este setor'}
            </small>
          </button>
        ))}
      </div>

      <label className="field">
        <span>Observação do encaminhamento</span>
        <textarea
          value={observation}
          onChange={(event) => setObservation(event.target.value)}
          placeholder="Ex: paciente encaminhado após atendimento, realizar procedimento, retorno médico..."
          rows={4}
        />
      </label>
    </Modal>
  );
}