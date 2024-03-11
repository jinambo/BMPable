interface ToggleProps {
  toggle: (state: boolean) => void;
  state: boolean;
  style?: any;
  isBAW?: boolean; 
  disabled?: boolean;
}

const Toggle = ({ toggle, state, style, isBAW = false, disabled }: ToggleProps) => {
  return (
    <div
      className={!isBAW ? 'switch-parent--default' : undefined}
      style={style}
    >
      <label className="switch">
        <input type="checkbox" onChange={() => toggle(!state)} disabled={disabled} />
        <span className="slider round"></span>
      </label>
    </div>
  );
}

export default Toggle;
