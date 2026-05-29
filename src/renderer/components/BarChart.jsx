export default function BarChart({
  title,
  subtitle,
  data,
  suffix = '',
  emptyMessage = 'Nenhum dado encontrado.'
}) {
  const maxValue = Math.max(...data.map((item) => item.value), 0);

  return (
    <section className="chart-card">
      <div className="chart-header">
        <div>
          <p className="eyebrow">Indicador</p>
          <h2>{title}</h2>
          {subtitle && <span>{subtitle}</span>}
        </div>
      </div>

      <div className="bar-chart">
        {data.length === 0 ? (
          <div className="chart-empty">{emptyMessage}</div>
        ) : (
          data.map((item) => {
            const percentage =
              maxValue === 0 ? 0 : Math.max((item.value / maxValue) * 100, 4);

            return (
              <div className="bar-row" key={item.key}>
                <div className="bar-label">
                  <strong>{item.label}</strong>
                  <span>
                    {item.value}
                    {suffix}
                  </span>
                </div>

                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}