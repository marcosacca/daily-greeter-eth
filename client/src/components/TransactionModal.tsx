import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { formatAddress } from "@/lib/utils/format";
import { CheckCircle } from "lucide-react";

interface TransactionModalProps {
  isOpen: boolean;
  transaction: TransactionType | null;
  closeModal: () => void;
}

const TransactionModal = ({ isOpen, transaction, closeModal }: TransactionModalProps) => {
  const { t } = useTranslation();
  
  if (!transaction) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center">
            {t("transactionSuccessful")}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t("transactionSuccessDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-3">{t("transactionDetails")}</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{t("transactionHash")}:</span>
              <a 
                href={`https://etherscan.io/tx/${transaction.txHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:text-primary-700 font-medium"
              >
                {formatAddress(transaction.txHash)}
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{t("type")}:</span>
              <span className="text-sm text-gray-700">
                {transaction.type === "greeting" ? t("greeting") : t("nftMint")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{t("date")}:</span>
              <span className="text-sm text-gray-700">
                {new Date(transaction.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{t("amount")}:</span>
              <span className="text-sm text-gray-700">{transaction.amount} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">{t("status")}:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                transaction.status === "confirmed" 
                  ? "bg-green-100 text-green-800" 
                  : transaction.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}>
                {transaction.status === "confirmed" ? t("confirmed") : 
                 transaction.status === "pending" ? t("pending") : t("failed")}
              </span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={closeModal} className="w-full">
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
