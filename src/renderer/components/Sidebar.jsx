import { NavLink } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';
import { canAccess } from '../data/permissions.js';

const menuItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    permission: 'DASHBOARD'
  },
  {
    label: 'Recepção',
    path: '/recepcao',
    permission: 'RECEPCAO'
  },
  {
    label: 'Acolhimento',
    path: '/acolhimento',
    permission: 'ACOLHIMENTO'
  },
  {
    label: 'Médico',
    path: '/medico',
    permission: 'MEDICO'
  },
  {
    label: 'Sala de E.C.G.',
    path: '/ecg',
    permission: 'ECG'
  },
  {
    label: 'Medicação',
    path: '/medicacao',
    permission: 'MEDICACAO'
  },
  {
    label: 'Curativo',
    path: '/curativo',
    permission: 'CURATIVO'
  },
  {
    label: 'ECO',
    path: '/eco',
    permission: 'ECO'
  },
  {
    label: 'Mapa Cirúrgico',
    path: '/mapa-cirurgico',
    permission: 'MAPA_CIRURGICO'
  },
  {
    label: 'Painel',
    path: '/painel',
    permission: 'PAINEL'
  },
  {
    label: 'Administração',
    path: '/admin',
    permission: 'ADMIN'
  }
];

export default function Sidebar() {
  const { user } = useAuth();

  const visibleItems = menuItems.filter((item) =>
    canAccess(user, item.permission)
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="mini-logo">+</div>

        <div>
          <strong>Monitor Amb</strong>
          <span>IECAC</span>
        </div>
      </div>

      <div className="sidebar-user">
        <span>Usuário logado</span>
        <strong>{user?.nome}</strong>
        <small>{user?.perfil}</small>
      </div>

      <nav className="sidebar-nav">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}