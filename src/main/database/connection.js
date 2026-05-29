import { getAccessConnectionString } from './dbConfig.js';

let connection = null;

export async function getConnection() {
  if (connection) {
    return connection;
  }

  if (process.platform !== 'win32') {
    throw new Error(
      'Microsoft Access só será conectado no Windows com o driver ODBC instalado.'
    );
  }

  const odbc = await import('odbc');

  connection = await odbc.connect(getAccessConnectionString());

  return connection;
}

export async function closeConnection() {
  if (!connection) {
    return;
  }

  await connection.close();
  connection = null;
}

export async function query(sql, params = []) {
  const db = await getConnection();

  return db.query(sql, params);
}

export async function execute(sql, params = []) {
  const db = await getConnection();

  return db.query(sql, params);
}