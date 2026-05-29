import { useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import Splash from './pages/Splash.jsx';
import Login from './pages/Login.jsx';

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
    <HashRouter>
      <Routes>
        <Route path="/" element={<Splash appInfo={appInfo} />} />
        <Route path="/login" element={<Login appInfo={appInfo} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}