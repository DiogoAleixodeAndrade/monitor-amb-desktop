export default function AdminSection({
  title,
  subtitle,
  actionLabel,
  onAction,
  children
}) {
  return (
    <section className="admin-section">
      <header className="admin-section-header">
        <div>
          <p className="eyebrow">Administração</p>
          <h2>{title}</h2>
          {subtitle && <span>{subtitle}</span>}
        </div>

        {actionLabel && (
          <button
            className="admin-action-button"
            type="button"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        )}
      </header>

      {children}
    </section>
  );
}