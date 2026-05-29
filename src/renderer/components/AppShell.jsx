import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

export default function AppShell({ title, subtitle, children }) {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="content-area">
        <Header title={title} subtitle={subtitle} />

        <section className="page-content">{children}</section>
      </main>
    </div>
  );
}