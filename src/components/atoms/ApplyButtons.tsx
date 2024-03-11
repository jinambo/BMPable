import React, { useContext } from 'react';
import { ImageContext } from '../ImageProvider';

interface ApplyButtonsProps {
  disabled?: boolean;
  onApply?: () => void;
  onDiscard?: () => void;
}

const ApplyButtons: React.FC<ApplyButtonsProps> = ({
  disabled,
  onApply,
  onDiscard
}) => {
  const {
    applyChanges,
    discardChanges
  } = useContext(ImageContext);

  const handleApply = () => {
    applyChanges();
    onApply();
  }

  const handleDiscard = () => {
    discardChanges();
    onDiscard();
  }

  return (
    <div className="toolbar-item__buttons flex-middle">
      <button
        className="button button--small"
        onClick={handleApply}
        disabled={disabled}
      >
        Apply changes
      </button> 
      <button
        className="button button--small"
        onClick={handleDiscard}
        disabled={disabled}
      >
        Discard
      </button> 
    </div>
  );
};

export default ApplyButtons;
