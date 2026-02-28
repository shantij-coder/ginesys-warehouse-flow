import CapacityBar from "./CapacityBar";

interface BinContextBarProps {
  binCode: string;
  availableCapacity: number;
  scannedQty: number;
  assortment?: string;
}

const BinContextBar = ({ binCode, availableCapacity, scannedQty, assortment }: BinContextBarProps) => {
  const usedPercentage = availableCapacity > 0 ? Math.round((scannedQty / availableCapacity) * 100) : 0;

  return (
    <div className="border-b bg-card/80 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <span className="text-badge font-bold text-primary">BIN</span>
          </div>
          <div>
            <p className="font-mono text-card-name font-semibold text-card-foreground">{binCode}</p>
            {assortment && (
              <span className="inline-flex items-center rounded-pill bg-secondary px-2 py-0.5 text-badge text-secondary-foreground mt-0.5">
                {assortment}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-badge text-muted-foreground">Scanned</p>
          <p className="text-section text-primary">{scannedQty} <span className="text-badge text-muted-foreground">/ {availableCapacity}</span></p>
        </div>
      </div>
      <div className="mt-2.5">
        <CapacityBar percentage={usedPercentage} />
      </div>
    </div>
  );
};

export default BinContextBar;
