import { GlobalMessageProps } from "../../types/GlobalMessageProps";

const Colors = {
  warn: '#ff9966',
  err: '#cc3300',
  succ: '#99cc33'
};

const GlobalMessage: React.FC<GlobalMessageProps> = ({
  text,
  type
}) => {
  return (
    <div
      className="global-message"
      style={{ backgroundColor: Colors[type] }}
    >
      {text}
    </div>
  );
}

export default GlobalMessage
