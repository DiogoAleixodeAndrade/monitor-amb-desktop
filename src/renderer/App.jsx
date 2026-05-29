import { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import { QueueProvider } from './context/QueueContext.jsx';

import Splash from './pages/Splash.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Recepcao from './pages/Recepcao.jsx';
import Acolhimento from './pages/Acolhimento.jsx';
import Medico from './pages/Medico.jsx';
import ECG from './pages/ECG.jsx';
import Medicacao from './pages/Medicacao.jsx';
import Curativo from './pages/Curativo.jsx';
import ECO from './pages/ECO.jsx';
import MapaCirurgico from './pages/MapaCirurgico.jsx';
import Painel from './pages/Painel.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  const [appInfo, setAppInfo] = useState(null);

  useEffect(() => {
    async function loadAppInfo() {
      if (window.monitorAmb?.app?.getInfo) {
        const info = await window.monitorAmb.app.getInfo();
        setAppInfo(info);
        return;
      }

      setAppInfo({
        name: 'Monitor Amb',
        institution: 'IECAC',
        environment: 'codespace-browser',
        version: '1.0.0'
      });
    }

    loadAppInfo();
  }, []);

  return (
    <AuthProvider>
      <QueueProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Splash appInfo={appInfo} />} />
            <Route path="/login" element={<Login appInfo={appInfo} />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute permission="DASHBOARD">
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recepcao"
              element={
                <ProtectedRoute permission="RECEPCAO">
                  <Recepcao />
                </ProtectedRoute>
              }
            />

            <Route
              path="/acolhimento"
              element={
                <ProtectedRoute permission="ACOLHIMENTO">
                  <Acolhimento />
                </ProtectedRoute>
              }
            />

            <Route
              path="/medico"
              element={
                <ProtectedRoute permission="MEDICO">
                  <Medico />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ecg"
              element={
                <ProtectedRoute permission="ECG">
                  <ECG />
                </ProtectedRoute>
              }
            />

            <Route
              path="/medicacao"
              element={
                <ProtectedRoute permission="MEDICACAO">
                  <Medicacao />
                </ProtectedRoute>
              }
            />

            <Route
              path="/curativo"
              element={
                <ProtectedRoute permission="CURATIVO">
                  <Curativo />
                </ProtectedRoute>
              }
            />

            <Route
              path="/eco"
              element={
                <ProtectedRoute permission="ECO">
                  <ECO />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mapa-cirurgico"
              element={
                <ProtectedRoute permission="MAPA_CIRURGICO">
                  <MapaCirurgico />
                </ProtectedRoute>
              }
            />

            <Route
              path="/painel"
              element={
                <ProtectedRoute permission="PAINEL">
                  <Painel />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute permission="ADMIN">
                  <Admin />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </QueueProvider>
    </AuthProvider>
  );
}