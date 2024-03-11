import React, { useContext } from 'react';
import { ImageContext } from '../ImageProvider';

interface DiscardButtonProps {
  disabled?: boolean;
  onDiscard?: () => void;
}

const DiscardButton: React.FC<DiscardButtonProps> = ({
  disabled,
  onDiscard = null
}) => {
  const {
    discardChanges
  } = useContext(ImageContext);

  const handleDiscard = () => {
    discardChanges();

    if (onDiscard !== null) {
      onDiscard();
    }
  }

  return (
    <button
        className="button button--small"
        onClick={handleDiscard}
        disabled={disabled}
    >
        Discard
    </button> 
  );
};

export default DiscardButton;
