import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { NetworkStatus } from "@/types";

interface NetworkBannerProps {
  networkStatus: NetworkStatus;
}

const NetworkBanner = ({ networkStatus }: NetworkBannerProps) => {
  const { t } = useTranslation();
  
  if (networkStatus === "connected") return null;
  
  return (
    <Alert className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md flex items-start">
      <AlertTriangle className="h-5 w-5 text-yellow-400" />
      <AlertDescription className="ml-3 text-sm text-yellow-700">
        {networkStatus === "wrong_network" 
          ? t("wrongNetwork") 
          : t("connectMetamask")}
      </AlertDescription>
    </Alert>
  );
};

export default NetworkBanner;
