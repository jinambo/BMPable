interface ToggleProps {
  toggle: (state: boolean) => void;
  state: boolean;
  style?: any;
  isBAW?: boolean; 
}

const Toggle = ({ toggle, state, style, isBAW = false }: ToggleProps) => {
  return (
    <div
      className={!isBAW && 'switch-parent--default'}
      style={style}
    >
      <label className="switch">
        <input type="checkbox" onChange={ () => toggle(!state)} />
        <span className="slider round"></span>
      </label>
    </div>
  );
}

export default Toggle;
