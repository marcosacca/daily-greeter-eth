import { useState } from "react";
import { useWallet } from "@/lib/hooks/useWallet";
import { useGreeter } from "@/lib/hooks/useGreeter";
import { useNFT } from "@/lib/hooks/useNFT";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, CheckCircle, Clock, Sparkles } from "lucide-react";
import { TransactionType } from "@/types";
import { formatDate } from "@/lib/utils/format";
import { GREETING_FEE, NFT_MINTING_FEE, ESTIMATED_GAS } from "@/lib/constants";
import { Switch } from "@/components/ui/switch";

interface DailyGreetingsProps {
  openTransactionModal: (transaction: TransactionType) => void;
}

const DailyGreetings = ({ openTransactionModal }: DailyGreetingsProps) => {
  const { t } = useTranslation();
  const { account } = useWallet();
  const { lastGreetingDay, canSendGreetingToday, sendGreeting, isLoading: isGreetingLoading } = useGreeter();
  const { mintNFT, isLoading: isNFTLoading } = useNFT();
  
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [mintAsNFT, setMintAsNFT] = useState(false);
  const [title, setTitle] = useState("My Greeting NFT");
  
  const isLoading = isGreetingLoading || isNFTLoading;
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    if (value.length > 20) {
      setMessageError(t("messageTooLong"));
    } else {
      setMessageError("");
    }
  };
  
  const handleSendGreeting = async () => {
    if (!account || !message || message.length > 20 || isLoading) return;
    
    try {
      let transaction;
      
      if (mintAsNFT) {
        // Mint as NFT
        transaction = await mintNFT(title, message);
      } else {
        // Send as regular greeting
        transaction = await sendGreeting(message);
      }
      
      if (transaction) {
        openTransactionModal(transaction);
        setMessage("");
      }
    } catch (error) {
      console.error("Failed to send greeting:", error);
    }
  };
  
  // Calculate total ETH cost based on user choice
  const totalCost = mintAsNFT ? (NFT_MINTING_FEE + ESTIMATED_GAS) : (GREETING_FEE + ESTIMATED_GAS);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t("sendDailyGreeting")}</h2>
          
          <div className="mb-6">
            <label htmlFor="greeting-message" className="block text-sm font-medium text-gray-700 mb-1">
              {t("yourGreetingMessage")}
            </label>
            <Textarea
              id="greeting-message"
              value={message}
              onChange={handleMessageChange}
              placeholder={t("enterGreetingMessage")}
              rows={2}
              maxLength={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <div className="mt-1 flex justify-between">
              <p className="text-xs text-gray-500">{message.length}/20</p>
              {messageError && <p className="text-xs text-red-500">{messageError}</p>}
            </div>
          </div>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t("transactionDetails")}</h3>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{t("greetingFee")}</span>
              <span className="text-sm font-medium">{GREETING_FEE} ETH</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">{t("networkFeeEst")}</span>
              <span className="text-sm font-medium">~{ESTIMATED_GAS} ETH</span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">{t("totalEst")}</span>
              <span className="text-sm font-medium">~{totalCost} ETH</span>
            </div>
          </div>
          
          <div>
            {!account ? (
              <Button disabled className="w-full bg-gray-400 text-white py-3">
                {t("connectWalletToContinue")}
              </Button>
            ) : isLoading ? (
              <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("processing")}
              </Button>
            ) : (
              <Button 
                onClick={handleSendGreeting}
                disabled={!message || message.length > 280 || !canSendGreetingToday}
                className="w-full"
              >
                {t("sendGreeting")}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="md:col-span-1">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t("greetingStatus")}</h2>
          
          {account ? (
            <>
              {lastGreetingDay && (
                <div className="p-4 bg-primary-50 rounded-md mb-4 border border-primary-200">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-primary-800">{t("lastGreetingSent")}</h3>
                      <p className="mt-1 text-sm text-primary-700">
                        {formatDate(lastGreetingDay)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {canSendGreetingToday ? (
                <div className="p-4 bg-green-50 rounded-md border border-green-200">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">{t("canSendGreeting")}</h3>
                      <p className="mt-1 text-sm text-green-700">{t("oneGreetingPerDay")}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">{t("alreadySentGreeting")}</h3>
                      <p className="mt-1 text-sm text-yellow-700">{t("canSendTomorrow")}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 text-center">{t("connectToSeeStatus")}</p>
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">{t("howItWorks")}</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-full bg-primary-100 text-primary text-xs font-medium mr-2">1</span>
                <span>{t("writeGreeting")}</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-full bg-primary-100 text-primary text-xs font-medium mr-2">2</span>
                <span>{t("paySmallFee")}</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-full bg-primary-100 text-primary text-xs font-medium mr-2">3</span>
                <span>{t("greetingRecorded")}</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 inline-flex items-center justify-center rounded-full bg-primary-100 text-primary text-xs font-medium mr-2">4</span>
                <span>{t("oneGreetingPerDay")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyGreetings;
