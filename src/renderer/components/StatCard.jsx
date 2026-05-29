export default function StatCard({ label, value, description, tone = 'blue' }) {
  return (
    <article className={`dashboard-stat dashboard-stat-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{description}</small>
    </article>
  );
}