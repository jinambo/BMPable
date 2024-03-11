import React, { useContext } from 'react';
import { ImageContext } from '../ImageProvider';

interface ApplyButtonProps {
  disabled?: boolean;
  onApply?: () => void;
}

const ApplyButtons: React.FC<ApplyButtonProps> = ({
  disabled,
  onApply = null
}) => {
  const {
    applyChanges,
  } = useContext(ImageContext);

  const handleApply = () => {
    applyChanges();

    if (onApply !== null) {
      onApply();
    }
  }

  return (
    <button
        className="button button--small"
        onClick={handleApply}
        disabled={disabled}
    >
      Apply changes
    </button> 
  );
};

export default ApplyButtons;
