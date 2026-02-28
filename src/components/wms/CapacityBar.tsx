interface CapacityBarProps {
  percentage: number;
  showLabel?: boolean;
}

const CapacityBar = ({ percentage, showLabel = true }: CapacityBarProps) => {
  const clamped = Math.max(0, percentage);
  const displayWidth = Math.min(clamped, 100);

  const getColor = () => {
    if (clamped > 100) return "bg-destructive";
    if (clamped > 90) return "bg-warn";
    if (clamped > 70) return "bg-warn animate-pulse-bar";
    return "bg-primary";
  };

  const getLabel = () => {
    if (clamped > 100) return "OVER CAPACITY";
    if (clamped > 90) return `${clamped}% — Nearly Full`;
    if (clamped > 70) return `${clamped}% — Nearing capacity`;
    return `${clamped}% Used`;
  };

  return (
    <div className="space-y-1">
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${getColor()}`}
          style={{ width: `${displayWidth}%` }}
        />
        {clamped > 100 && (
          <div className="absolute inset-0 rounded-full border-2 border-destructive" />
        )}
      </div>
      {showLabel && (
        <p className={`text-badge ${clamped > 100 ? "text-destructive font-bold" : clamped > 70 ? "text-warn" : "text-muted-foreground"}`}>
          {getLabel()}
        </p>
      )}
    </div>
  );
};

export default CapacityBar;
