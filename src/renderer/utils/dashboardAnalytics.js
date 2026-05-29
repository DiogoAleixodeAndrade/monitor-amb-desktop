export const dashboardSectorLabels = {
  ACOLHIMENTO: 'Acolhimento',
  MEDICO: 'Médico',
  ECG: 'Sala de E.C.G.',
  MEDICACAO: 'Medicação',
  CURATIVO: 'Curativo',
  ECO: 'ECO',
  MAPA_CIRURGICO: 'Mapa 24h'
};

export function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getCurrentMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

export function filterDashboardData(data, filters) {
  return data.filter((item) => {
    const entryDate = item.dataHoraEntrada?.slice(0, 10);
    const entryMonth = item.dataHoraEntrada?.slice(0, 7);

    if (filters.period === 'TODAY' && entryDate !== getTodayKey()) {
      return false;
    }

    if (filters.period === 'MONTH' && entryMonth !== getCurrentMonthKey()) {
      return false;
    }

    if (filters.sector !== 'ALL' && item.setorAtual !== filters.sector) {
      return false;
    }

    if (
      filters.doctor !== 'ALL' &&
      item.nomeMedicoDestino !== filters.doctor
    ) {
      return false;
    }

    return true;
  });
}

export function getDashboardMetrics(data) {
  const todayKey = getTodayKey();
  const monthKey = getCurrentMonthKey();

  const patientsToday = data.filter(
    (item) => item.dataHoraEntrada?.slice(0, 10) === todayKey
  ).length;

  const consultationsMonth = data.filter(
    (item) => item.dataHoraEntrada?.slice(0, 7) === monthKey
  ).length;

  const waiting = data.filter(
    (item) =>
      item.statusAtendimento === 'AGUARDANDO' ||
      item.statusAtendimento === 'AGUARDANDO_RETORNO_ECO'
  ).length;

  const inProgress = data.filter(
    (item) => item.statusAtendimento === 'EM_ATENDIMENTO'
  ).length;

  const priority = data.filter((item) => item.prioritario).length;

  const missing = data.filter(
    (item) => item.statusAtendimento === 'NAO_COMPARECEU'
  ).length;

  const eco = data.filter(
    (item) =>
      item.setorAtual === 'ECO' ||
      item.tipoExame === 'ECO' ||
      item.retornoExame
  ).length;

  const mapa24h = data.filter(
    (item) => item.setorAtual === 'MAPA_CIRURGICO'
  ).length;

  return {
    patientsToday,
    consultationsMonth,
    waiting,
    inProgress,
    priority,
    missing,
    eco,
    mapa24h
  };
}

export function groupCountBy(data, field, labelMap = {}) {
  const grouped = data.reduce((acc, item) => {
    const key = item[field] || 'Não informado';

    acc[key] = (acc[key] || 0) + 1;

    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([key, value]) => ({
      key,
      label: labelMap[key] || key,
      value
    }))
    .sort((a, b) => b.value - a.value);
}

export function getAverageAttendanceMinutes(item) {
  if (!item.dataHoraApareceu || !item.dataHoraCheckout) {
    return null;
  }

  const start = new Date(item.dataHoraApareceu).getTime();
  const end = new Date(item.dataHoraCheckout).getTime();

  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return null;
  }

  return Math.round((end - start) / 60000);
}

export function groupAverageTimeBy(data, field, labelMap = {}) {
  const grouped = data.reduce((acc, item) => {
    const minutes = getAverageAttendanceMinutes(item);

    if (minutes === null) {
      return acc;
    }

    const key = item[field] || 'Não informado';

    if (!acc[key]) {
      acc[key] = {
        total: 0,
        count: 0
      };
    }

    acc[key].total += minutes;
    acc[key].count += 1;

    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([key, value]) => ({
      key,
      label: labelMap[key] || key,
      value: Math.round(value.total / value.count)
    }))
    .sort((a, b) => b.value - a.value);
}

export function getUniqueDoctors(data) {
  return [...new Set(data.map((item) => item.nomeMedicoDestino).filter(Boolean))]
    .sort()
    .map((doctor) => ({
      value: doctor,
      label: doctor
    }));
}