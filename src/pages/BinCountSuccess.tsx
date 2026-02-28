import SuccessScreen from "@/components/wms/SuccessScreen";
import { useLocation } from "react-router-dom";

const BinCountSuccess = () => {
  const location = useLocation();
  const { docNumber, itemCount } = (location.state as any) || { docNumber: "BC-000001", itemCount: 0 };

  return (
    <SuccessScreen
      message="Bin Count completed successfully!"
      docNumber={docNumber}
      details={`${itemCount} item${itemCount !== 1 ? "s" : ""} counted. Bin unlocked.`}
      continuePath="/bincount"
      continueLabel="CONTINUE"
    />
  );
};

export default BinCountSuccess;
