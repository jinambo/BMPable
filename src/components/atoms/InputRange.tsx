import React, { useState } from 'react';

interface RangeInputProps {
  min: number;
  max: number;
  initialValue?: number;
  step?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

const RangeInput: React.FC<RangeInputProps> = ({
  min,
  max,
  initialValue = min,
  step = 1,
  disabled,
  onChange
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="input-range">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={handleChange}
        disabled={disabled}
        style={{
          width: '100%',
          margin: '5px 0',
        }}
      />
      <div style={{ marginLeft: '10px', fontSize: 12 }}>{value}</div>
    </div>
  );
};

export default RangeInput;
