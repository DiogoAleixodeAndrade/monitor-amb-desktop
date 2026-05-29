import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import Button from './Button.jsx';
import OpenPanelButton from './OpenPanelButton.jsx';

export default function Header({ title, subtitle }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const canOpenPanel =
    user?.perfil === 'ADM' ||
    user?.perfil === 'RECEPCAO' ||
    user?.perfil === 'PAINEL';

  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="topbar-actions">
        {canOpenPanel && <OpenPanelButton />}

        <Button variant="secondary" onClick={handleLogout}>
          Sair
        </Button>
      </div>
    </header>
  );
}