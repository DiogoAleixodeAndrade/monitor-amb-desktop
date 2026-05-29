import { useState } from 'react';

import Button from './Button.jsx';

export default function OpenPanelButton() {
  const [feedback, setFeedback] = useState('');

  async function handleOpenPanel() {
    setFeedback('');

    if (!window.monitorAmb?.panel?.openOnSecondScreen) {
      setFeedback(
        'O painel em segunda tela só funciona no aplicativo desktop. No Codespace, use a rota /painel para visualizar.'
      );
      return;
    }

    try {
      const result = await window.monitorAmb.panel.openOnSecondScreen();

      if (result?.success) {
        setFeedback('Painel aberto na TV em tela cheia.');
        return;
      }

      setFeedback('Não foi possível abrir o painel.');
    } catch {
      setFeedback('Erro ao tentar abrir o painel na segunda tela.');
    }
  }

  return (
    <div className="open-panel-box">
      <Button variant="secondary" onClick={handleOpenPanel}>
        Abrir painel na TV
      </Button>

      {feedback && <span>{feedback}</span>}
    </div>
  );
}