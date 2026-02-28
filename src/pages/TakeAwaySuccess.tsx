import SuccessScreen from "@/components/wms/SuccessScreen";
import { useLocation } from "react-router-dom";

const TakeAwaySuccess = () => {
  const location = useLocation();
  const { docNumber, itemCount } = (location.state as any) || { docNumber: "TA-000001", itemCount: 0 };

  return (
    <SuccessScreen
      message="Take Away generated successfully!"
      docNumber={docNumber}
      details={`${itemCount} item${itemCount !== 1 ? "s" : ""} taken away`}
      continuePath="/takeaway"
      continueLabel="CONTINUE"
    />
  );
};

export default TakeAwaySuccess;
