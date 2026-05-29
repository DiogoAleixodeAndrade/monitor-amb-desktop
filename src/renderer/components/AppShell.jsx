export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="mini-logo">+</div>
          <div>
            <strong>Monitor Amb</strong>
            <span>IECAC</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button>Dashboard</button>
          <button>Recepção</button>
          <button>Acolhimento</button>
          <button>Médico</button>
          <button>Painel</button>
        </nav>
      </aside>

      <section className="content-area">{children}</section>
    </div>
  );
}