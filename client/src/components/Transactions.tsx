import { useState } from "react";
import { useWallet } from "@/lib/hooks/useWallet";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types";
import { formatAddress } from "@/lib/utils/format";
import { Wallet, Receipt, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface TransactionsProps {
  openTransactionModal: (transaction: TransactionType) => void;
}

const Transactions = ({ openTransactionModal }: TransactionsProps) => {
  const { t } = useTranslation();
  const { account } = useWallet();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const { data: transactions, isLoading } = useQuery<TransactionType[]>({
    queryKey: [account ? `/api/transactions/${account}` : null],
    enabled: !!account,
  });
  
  const handleViewTransaction = (transaction: TransactionType) => {
    openTransactionModal(transaction);
  };
  
  // Calculate pagination
  const totalPages = transactions ? Math.ceil(transactions.length / itemsPerPage) : 0;
  const paginatedTransactions = transactions ? 
    transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : 
    [];
  
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">{t("recentTransactions")}</h2>
      </div>
      
      {account ? (
        <>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : transactions && transactions.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("transaction")}</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("type")}</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("date")}</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("amount")}</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("status")}</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t("details")}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedTransactions.map((tx: TransactionType) => (
                      <tr key={tx.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                          <a 
                            href={`https://etherscan.io/tx/${tx.txHash}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-primary-700 truncate block max-w-[180px]"
                          >
                            {formatAddress(tx.txHash)}
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.type === "greeting" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-purple-100 text-purple-800"
                          }`}>
                            {tx.type === "greeting" ? t("greeting") : t("nftMint")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(tx.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tx.amount} ETH
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.status === "confirmed" 
                              ? "bg-green-100 text-green-800" 
                              : tx.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}>
                            {tx.status === "confirmed" ? t("confirmed") : 
                             tx.status === "pending" ? t("pending") : t("failed")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            onClick={() => handleViewTransaction(tx)}
                            className="text-primary hover:text-primary-700"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {totalPages > 1 && (
                <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    {t("showing")} <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> {t("to")} <span className="font-medium">{Math.min(currentPage * itemsPerPage, transactions.length)}</span> {t("of")} <span className="font-medium">{transactions.length}</span> {t("transactionsLower")}
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">{t("previous")}</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                            currentPage === i + 1
                              ? "bg-primary-50 text-primary"
                              : "bg-white text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">{t("next")}</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Receipt className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">{t("noTransactionsFound")}</h3>
              <p className="text-gray-500 mb-6">{t("noTransactionsYet")}</p>
              <Button onClick={() => window.location.hash = "#daily-greetings"}>
                {t("sendFirstGreeting")}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Wallet className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{t("connectWallet")}</h3>
          <p className="text-gray-500 mb-6">{t("connectViewTransaction")}</p>
          <Button>
            {t("connectWallet")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Transactions;
