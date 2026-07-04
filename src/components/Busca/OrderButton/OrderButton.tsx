import './OrderButton.css';

interface Option {
  value: string;
  label: string;
}

interface ButtonOrderProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

export function ButtonOrder({
  value,
  onChange,
  options,
}: ButtonOrderProps) {
  return (
    <div className="button-order-container">
      <label htmlFor="button-order-select" className="sort-label">
        Ordenar por
      </label>

      <select
        id="button-order"
        className="button-order-box"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}