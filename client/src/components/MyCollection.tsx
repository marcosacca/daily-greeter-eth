import { useState } from "react";
import { useWallet } from "@/lib/hooks/useWallet";
import { useNFT } from "@/lib/hooks/useNFT";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NFTType } from "@/types";
import { Share2, ExternalLink, Wallet, Image } from "lucide-react";
import { formatAddress } from "@/lib/utils/format";

const MyCollection = () => {
  const { t } = useTranslation();
  const { account } = useWallet();
  const { nfts, isLoading } = useNFT();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("all");
  
  // Filter NFTs based on search term
  const filteredNFTs = nfts?.filter(nft => 
    nft.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    nft.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort NFTs based on sort option
  const sortedNFTs = [...(filteredNFTs || [])].sort((a, b) => {
    if (sortOption === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOption === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-0">{t("myNFTCollection")}</h2>
        
        {account && nfts && nfts.length > 0 && (
          <div className="flex space-x-2">
            <div className="relative">
              <Input
                type="text"
                placeholder={t("searchNFTs")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary py-2 pl-3 pr-8"
            >
              <option value="all">{t("all")}</option>
              <option value="latest">{t("latest")}</option>
              <option value="oldest">{t("oldest")}</option>
            </select>
          </div>
        )}
      </div>
      
      {account ? (
        <>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : nfts && nfts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedNFTs.map((nft: NFTType) => (
                  <NFTCard key={nft.tokenId} nft={nft} />
                ))}
              </div>
              
              {/* Pagination would go here for a real app with many NFTs */}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Image className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">{t("noNFTsFound")}</h3>
              <p className="text-gray-500 mb-6">{t("noNFTsYet")}</p>
              <Button onClick={() => window.location.hash = "#create-nft"}>
                {t("createFirstNFT")}
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
          <p className="text-gray-500 mb-6">{t("connectViewCollection")}</p>
          <Button>
            {t("connectWallet")}
          </Button>
        </div>
      )}
    </div>
  );
};

interface NFTCardProps {
  nft: NFTType;
}

const NFTCard = ({ nft }: NFTCardProps) => {
  const { t } = useTranslation();
  
  const handleShare = () => {
    // Implementation for sharing NFT
    if (navigator.share) {
      navigator.share({
        title: nft.title || "My NFT",
        text: nft.content,
        url: `https://etherscan.io/token/${import.meta.env.VITE_NFT_CONTRACT_ADDRESS}?a=${nft.tokenId}`,
      }).catch(err => console.error("Error sharing", err));
    } else {
      // Fallback for browsers that don't support Web Share API
      const url = `https://etherscan.io/token/${import.meta.env.VITE_NFT_CONTRACT_ADDRESS}?a=${nft.tokenId}`;
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };
  
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="bg-gradient-to-br from-primary-100 to-primary-200 p-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="font-medium text-primary-800 mb-2">{nft.title || "My NFT"}</h3>
          <p className="text-gray-700 text-sm">{nft.content}</p>
          <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {t("created")}: {new Date(nft.createdAt).toLocaleDateString()}
            </span>
            <span className="text-xs text-gray-500 truncate max-w-[100px]">
              {t("tokenId")}: #{nft.tokenId}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4 bg-white">
        <div className="flex justify-between items-center">
          <a 
            href={`https://etherscan.io/token/${import.meta.env.VITE_NFT_CONTRACT_ADDRESS}?a=${nft.tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:text-primary-700 font-medium flex items-center"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            {t("viewOnEtherscan")}
          </a>
          <button 
            onClick={handleShare}
            className="text-xs bg-primary-50 hover:bg-primary-100 text-primary-700 py-1 px-2 rounded transition flex items-center"
          >
            <Share2 className="h-3 w-3 mr-1" />
            {t("share")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyCollection;
