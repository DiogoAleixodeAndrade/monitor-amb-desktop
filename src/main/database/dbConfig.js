import path from 'node:path';
import { app } from 'electron';

export function getDatabasePath() {
  if (process.env.MONITOR_AMB_DB_PATH) {
    return process.env.MONITOR_AMB_DB_PATH;
  }

  if (process.env.NODE_ENV === 'development') {
    return path.join(process.cwd(), 'database', 'MonitorAmb.accdb');
  }

  return path.join(app.getPath('userData'), 'database', 'MonitorAmb.accdb');
}

export function getAccessConnectionString() {
  const databasePath = getDatabasePath();

  return [
    'Driver={Microsoft Access Driver (*.mdb, *.accdb)}',
    `Dbq=${databasePath}`,
    'Uid=Admin',
    'Pwd='
  ].join(';');
}