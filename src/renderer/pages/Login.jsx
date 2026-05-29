import { useState } from 'react';

import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';

export default function Login({ appInfo }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrarUsuario, setLembrarUsuario] = useState(true);

  function handleSubmit(event) {
    event.preventDefault();

    alert(
      `Próxima etapa: autenticar usuário "${usuario}" no banco Access com hash de senha.`
    );
  }

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="brand-mark large">
            <div className="brand-cross">+</div>
            <div className="brand-pulse" />
          </div>

          <p className="eyebrow">IECAC • Ambulatório</p>
          <h1>Monitor Amb</h1>

          <p>
            Sistema desktop profissional para recepção, acolhimento, salas
            assistenciais, médicos e painel de chamada.
          </p>

          <div className="hero-grid">
            <div>
              <strong>Fluxo seguro</strong>
              <span>Recepção → Atendimento → Check-out</span>
            </div>

            <div>
              <strong>Permissões</strong>
              <span>Acesso por perfil e setor</span>
            </div>

            <div>
              <strong>Painel local</strong>
              <span>Sem depender de internet</span>
            </div>

            <div>
              <strong>Fila inteligente</strong>
              <span>Prioridade, ECO e chamadas</span>
            </div>
          </div>
        </div>
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-header">
            <p className="eyebrow">Acesso ao sistema</p>
            <h2>Entrar no Monitor Amb</h2>
            <p>
              Use seu usuário institucional para acessar apenas os setores
              permitidos.
            </p>
          </div>

          <Input
            label="Usuário"
            placeholder="ex: joao.silva"
            value={usuario}
            onChange={(event) => setUsuario(event.target.value)}
            autoComplete="username"
          />

          <Input
            label="Senha"
            placeholder="Digite sua senha"
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            autoComplete="current-password"
          />

          <label className="check-row">
            <input
              type="checkbox"
              checked={lembrarUsuario}
              onChange={(event) => setLembrarUsuario(event.target.checked)}
            />
            <span>Lembrar usuário neste computador</span>
          </label>

          <Button type="submit">Entrar no sistema</Button>

          <div className="login-footer">
            <span>{appInfo?.institution || 'IECAC'}</span>
            <span>{appInfo ? `v${appInfo.version}` : 'Inicializando...'}</span>
          </div>
        </form>
      </section>
    </main>
  );
}