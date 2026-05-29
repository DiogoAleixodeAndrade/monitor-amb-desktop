import AppShell from '../components/AppShell.jsx';

export default function ECG() {
  return (
    <AppShell title="Sala de E.C.G." subtitle="Fila da sala de eletrocardiograma">
      <div className="module-card">
        <p className="eyebrow">Sala de E.C.G.</p>
        <h2>Pacientes aguardando E.C.G.</h2>
        <p>
          Aqui vamos criar a fila exclusiva da sala de E.C.G. com chamada,
          presença, ausência, check-out e encaminhamento.
        </p>
      </div>
    </AppShell>
  );
}