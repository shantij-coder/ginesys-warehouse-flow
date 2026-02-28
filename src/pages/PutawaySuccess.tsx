import { useNavigate, useLocation } from "react-router-dom";
import SuccessScreen from "@/components/wms/SuccessScreen";

const PutawaySuccess = () => {
  const location = useLocation();
  const { docNumber, itemCount } = (location.state as any) || { docNumber: "PA-000001", itemCount: 0 };

  return (
    <SuccessScreen
      message="Put Away generated successfully!"
      docNumber={docNumber}
      details={`${itemCount} item${itemCount !== 1 ? "s" : ""} put away`}
      continuePath="/bin-scan"
      continueLabel="CONTINUE"
    />
  );
};

export default PutawaySuccess;
