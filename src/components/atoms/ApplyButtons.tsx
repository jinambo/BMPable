import React, { useContext, useState } from 'react';
import { ImageContext } from '../ImageProvider';

interface ApplyButtonsProps {
  onApply?: () => void;
  onDiscard?: () => void;
}

const ApplyButtons: React.FC<ApplyButtonsProps> = ({
  onApply,
  onDiscard
}) => {
  const {
    applyChanges,
    discardChanges
  } = useContext(ImageContext);

  const handleApply = () => {
    applyChanges();
  }

  const handleDiscard = () => {
    discardChanges();
  }

  return (
    <div className="toolbar-item__buttons flex-middle">
      <button className="button button--small" onClick={handleApply}>
        Apply changes
      </button> 
      <button className="button button--small" onClick={handleDiscard}>
        Discard
      </button> 
    </div>
  );
};

export default ApplyButtons;
