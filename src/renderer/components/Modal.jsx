export default function Modal({
  open,
  title,
  subtitle,
  children,
  onClose,
  footer
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal-card" role="dialog" aria-modal="true">
        <header className="modal-header">
          <div>
            <p className="eyebrow">Monitor Amb</p>
            <h2>{title}</h2>
            {subtitle && <span>{subtitle}</span>}
          </div>

          <button className="modal-close" type="button" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="modal-body">{children}</div>

        {footer && <footer className="modal-footer">{footer}</footer>}
      </section>
    </div>
  );
}