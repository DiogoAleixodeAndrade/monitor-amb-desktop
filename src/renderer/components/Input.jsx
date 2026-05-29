export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete
}) {
  return (
    <label className="field">
      <span>{label}</span>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </label>
  );
}