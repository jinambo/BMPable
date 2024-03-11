import React, { useState } from 'react';

interface PositioningItemProps {
  Icon: any;
  onClick: () => void;
  isActive?: boolean;
  rotatedTimes?: number;
}

const PositioningItem: React.FC<PositioningItemProps> = ({
  Icon,
  onClick,
  isActive,
  rotatedTimes
}) => {
  const rotationDeg: number | null = rotatedTimes ? (rotatedTimes) * 90 : null;

  return (
    <div
      onClick={onClick}
      className={`positioning-item flex-middle ${isActive ? 'active' : undefined}`}
      style={{ transform: `rotate(${-rotationDeg}deg)` }}
    >
      <Icon />
    </div>
  );
};

export default PositioningItem;
