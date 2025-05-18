import { ethers } from "ethers";

/**
 * Checks if MetaMask is installed
 * @returns Boolean indicating if MetaMask is available
 */
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
};

/**
 * Gets the current chain ID
 * @returns Promise with the current chain ID in hex format
 */
export const getCurrentChainId = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) return null;
  
  try {
    return await window.ethereum!.request({ method: "eth_chainId" });
  } catch (error) {
    console.error("Error getting chain ID:", error);
    return null;
  }
};

/**
 * Converts Wei to ETH
 * @param wei Amount in Wei as a string or BigNumber
 * @returns Amount in ETH as a string with 6 decimal places
 */
export const weiToEth = (wei: string | ethers.BigNumberish): string => {
  return ethers.formatEther(wei).substring(0, 8);
};

/**
 * Creates a metadata JSON object for NFT tokens
 * @param title NFT title
 * @param content NFT content text
 * @returns JSON string with NFT metadata including SVG image
 */
export const createNFTMetadata = (title: string, content: string): string => {
  // Generate an SVG image with the text content
  const svgImage = generateTextToSVG(content, title);
  
  // Create a data URI for the SVG
  const imageDataURI = `data:image/svg+xml;base64,${btoa(svgImage)}`;
  
  // Generate full metadata with the image
  const metadata = {
    name: title,
    description: content,
    image: imageDataURI,
    attributes: [
      {
        trait_type: "Type",
        value: "Text"
      },
      {
        trait_type: "Created",
        value: new Date().toISOString()
      },
      {
        trait_type: "Length",
        value: content.length.toString()
      }
    ]
  };
  
  return JSON.stringify(metadata);
};

/**
 * Generates an SVG image with the provided text
 * @param text The text to include in the SVG
 * @param title Optional title to show at the top
 * @returns SVG markup as a string
 */
export const generateTextToSVG = (text: string, title?: string): string => {
  // Generate a gradient background color based on text
  const hue1 = (text.length * 7) % 360;
  const hue2 = (hue1 + 60) % 360;
  const hue3 = (hue2 + 60) % 360;
  
  // Escape the text to prevent XML issues
  const escapedText = text.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
  
  const escapedTitle = title ? title.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;') : '';
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="hsl(${hue1}, 70%, 20%)" />
        <stop offset="50%" stop-color="hsl(${hue2}, 70%, 15%)" />
        <stop offset="100%" stop-color="hsl(${hue3}, 70%, 10%)" />
      </linearGradient>
      <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="hsl(${hue1}, 80%, 75%)" />
        <stop offset="50%" stop-color="hsl(${hue2}, 80%, 65%)" />
        <stop offset="100%" stop-color="hsl(${hue3}, 80%, 75%)" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <pattern id="pattern" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
        <rect width="2" height="2" fill="rgba(255,255,255,0.05)" />
      </pattern>
    </defs>
    <rect width="500" height="500" fill="url(#bg)" />
    <rect width="500" height="500" fill="url(#pattern)" />
    <rect x="50" y="100" width="400" height="300" rx="15" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
    ${title ? `<text x="250" y="60" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="url(#textGradient)" filter="url(#glow)">${escapedTitle}</text>` : ''}
    <text x="70" y="150" font-family="Arial, sans-serif" font-size="20" fill="url(#textGradient)">
      <tspan x="250" text-anchor="middle">"${escapedText}"</tspan>
    </text>
    <text x="70" y="420" font-family="Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.6)">
      <tspan x="250" text-anchor="middle">GreetingNFT • Created ${new Date().toLocaleDateString()}</tspan>
    </text>
  </svg>`;
};

/**
 * Gets an ethers.js contract instance
 * @param address Contract address
 * @param abi Contract ABI
 * @param signerOrProvider Signer or provider instance
 * @returns Contract instance
 */
export const getContract = (
  address: string,
  abi: ethers.ContractInterface,
  signerOrProvider: ethers.Signer | ethers.Provider
): ethers.Contract => {
  return new ethers.Contract(address, abi, signerOrProvider);
};
