import React, { useState } from 'react';

interface PositioningItemProps {
  Icon: any;
  onClick: () => void;
}

const PositioningItem: React.FC<PositioningItemProps> = ({
  Icon,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="positioning-item flex-middle"
    >
      <Icon />
    </div>
  );
};

export default PositioningItem;
