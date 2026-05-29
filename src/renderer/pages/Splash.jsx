import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash({ appInfo }) {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1600);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="splash-page">
      <section className="splash-card">
        <div className="brand-mark">
          <div className="brand-cross">+</div>
          <div className="brand-pulse" />
        </div>

        <div className="splash-content">
          <p className="eyebrow">Instituto Estadual de Cardiologia</p>
          <h1>Monitor Amb</h1>
          <p className="subtitle">Painel de Chamadas do Ambulatório IECAC</p>

          <div className="loading-line">
            <span />
          </div>

          <p className="version">
            {appInfo
              ? `Ambiente: ${appInfo.environment} • v${appInfo.version}`
              : 'Carregando sistema...'}
          </p>
        </div>
      </section>
    </main>
  );
}