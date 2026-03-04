import { memo } from 'react';

interface StateShapeProps {
  d: string;
  stateAbbr: string;
  fillColor: string;
  onHover: (stateAbbr: string | null, event: React.MouseEvent) => void;
  onClick: (stateAbbr: string) => void;
}

export const StateShape = memo(function StateShape({
  d,
  stateAbbr,
  fillColor,
  onHover,
  onClick,
}: StateShapeProps) {
  return (
    <path
      d={d}
      fill={fillColor}
      stroke="#cbd5e1"
      strokeWidth={0.5}
      data-state={stateAbbr}
      onMouseEnter={(e) => onHover(stateAbbr, e)}
      onMouseLeave={(e) => onHover(null, e)}
      onClick={() => onClick(stateAbbr)}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label={stateAbbr}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(stateAbbr);
        }
      }}
    />
  );
});
