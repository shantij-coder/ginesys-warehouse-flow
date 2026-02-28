import SuccessScreen from "@/components/wms/SuccessScreen";
import { useLocation } from "react-router-dom";

const PickListSuccess = () => {
  const location = useLocation();
  const { docNumber, itemCount } = (location.state as any) || { docNumber: "PL-000001", itemCount: 0 };

  return (
    <SuccessScreen
      message="Pick list confirmed successfully!"
      docNumber={docNumber}
      details={`${itemCount} item${itemCount !== 1 ? "s" : ""} picked`}
      continuePath="/picklist"
      continueLabel="CONTINUE"
    />
  );
};

export default PickListSuccess;
