export default function DonutChart({ title, subtitle, items }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="chart-card donut-card">
      <div className="chart-header">
        <div>
          <p className="eyebrow">Distribuição</p>
          <h2>{title}</h2>
          {subtitle && <span>{subtitle}</span>}
        </div>
      </div>

      <div className="donut-layout">
        <div
          className="donut-visual"
          style={{
            background: buildDonutGradient(items, total)
          }}
        >
          <div>
            <strong>{total}</strong>
            <span>total</span>
          </div>
        </div>

        <div className="donut-legend">
          {items.map((item, index) => (
            <div className="donut-legend-row" key={item.key}>
              <i className={`legend-dot legend-dot-${index + 1}`} />
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function buildDonutGradient(items, total) {
  if (!total) {
    return 'conic-gradient(var(--gray-200) 0deg 360deg)';
  }

  const colors = [
    'var(--iecac-blue-700)',
    'var(--iecac-red-600)',
    '#7c3aed',
    '#17803d',
    '#f5a524',
    '#0ea5e9',
    '#64748b'
  ];

  let current = 0;

  const parts = items.map((item, index) => {
    const start = current;
    const angle = (item.value / total) * 360;
    const end = start + angle;
    current = end;

    return `${colors[index % colors.length]} ${start}deg ${end}deg`;
  });

  return `conic-gradient(${parts.join(', ')})`;
}