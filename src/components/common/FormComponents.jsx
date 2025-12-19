import PropTypes from 'prop-types';

export function Input({ label, id, type = 'text', value, onChange, placeholder, className = '' }) {
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="block mb-1 font-bold text-gray-700">{label}</label>}
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`form-input ${className}`}
      />
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export function Select({ label, id, value, onChange, options, className = '' }) {
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="block mb-1 font-bold text-gray-700">{label}</label>}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`form-select ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

Select.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  className: PropTypes.string,
};

export function Textarea({ label, id, value, onChange, placeholder, rows = 3, className = '' }) {
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="block mb-1 font-bold text-gray-700">{label}</label>}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`form-textarea ${className}`}
      />
    </div>
  );
}

Textarea.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  className: PropTypes.string,
};

export function RangeSlider({ label, id, value, onChange, min = 1, max = 100 }) {
  return (
    <div className="mb-4">
      {label && <label htmlFor={id} className="block mb-2 font-bold text-sm sm:text-base text-gray-700">{label}</label>}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="flex-1 cursor-pointer"
          style={{ 
            height: '44px',
            WebkitAppearance: 'none',
            appearance: 'none',
            background: `linear-gradient(to right, #d32f2f 0%, #d32f2f ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`,
            borderRadius: '8px',
            outline: 'none',
          }}
        />
        <div className="flex items-center gap-2 justify-center">
          <span className="text-lg font-bold text-primary min-w-[50px] text-center">{value}%</span>
          <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={(e) => {
              let v = parseInt(e.target.value) || min;
              if (v > max) v = max;
              if (v < min) v = min;
              onChange(v);
            }}
            className="w-16 sm:w-20 p-2 border border-gray-300 rounded-lg text-center text-base"
            style={{ minHeight: '44px' }}
          />
        </div>
      </div>
    </div>
  );
}

RangeSlider.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
};

export function Checkbox({ label, id, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export function SubField({ label, statusId, statusValue, statusOptions, onStatusChange, remarkId, remarkValue, onRemarkChange }) {
  return (
    <div className="sub-field p-3 bg-gray-50 rounded-lg">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Select
            label={label}
            id={statusId}
            value={statusValue}
            onChange={onStatusChange}
            options={statusOptions}
          />
        </div>
        <div className="flex-1">
          <Textarea
            label="Remark"
            id={remarkId}
            value={remarkValue}
            onChange={onRemarkChange}
            rows={2}
            placeholder="Add remarks..."
          />
        </div>
      </div>
    </div>
  );
}

SubField.propTypes = {
  label: PropTypes.string.isRequired,
  statusId: PropTypes.string.isRequired,
  statusValue: PropTypes.string.isRequired,
  statusOptions: PropTypes.array.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  remarkId: PropTypes.string.isRequired,
  remarkValue: PropTypes.string,
  onRemarkChange: PropTypes.func.isRequired,
};
