import { useWallet } from "@/lib/hooks/useWallet";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { formatAddress } from "@/lib/utils/format";

const AppHeader = () => {
  const { account, connectWallet } = useWallet();
  const { t } = useTranslation();

  return (
    <header className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 shadow-md border-b border-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-5">
          <div className="logo-container">
            <div className="logo-glow"></div>
            <h1 className="text-3xl font-extrabold gradient-text tracking-wider">GreetingNFT</h1>
          </div>
          
          <div className="flex items-center space-x-4">            
            {/* Connect Wallet Button / Account Display */}
            {!account ? (
              <Button 
                onClick={connectWallet} 
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 shadow-lg"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12V7H5C4.46957 7 3.96086 6.78929 3.58579 6.41421C3.21071 6.03914 3 5.53043 3 5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H21V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 16H21V12H16C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14C14 14.5304 14.2107 15.0391 14.5858 15.4142C14.9609 15.7893 15.4696 16 16 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{t("connectWallet")}</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2 py-1 px-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-md border border-green-200 shadow-sm">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                  {formatAddress(account)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
