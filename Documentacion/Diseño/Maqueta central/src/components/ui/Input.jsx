export default function Input({
  label,
  type        = 'text',
  placeholder = '',
  value,
  onChange,
  maxLength,
  required    = false,
  className   = '',
  ...rest
}) {
  return (
    <div>
      {label && <label className="label-base">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        required={required}
        className={`input-base ${className}`}
        {...rest}
      />
    </div>
  )
}
