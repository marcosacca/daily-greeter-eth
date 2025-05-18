/**
 * Formats an Ethereum address for display by shortening it
 * @param address The full Ethereum address
 * @returns Shortened address (e.g., 0x1234...5678)
 */
export const formatAddress = (address: string): string => {
  if (!address) return "";
  if (address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Formats a date from Unix timestamp (days) to human-readable format
 * @param timestamp Unix timestamp in days
 * @returns Formatted date string
 */
export const formatDate = (timestamp: Date | number | null): string => {
  if (!timestamp) return "";
  
  const date = new Date(timestamp);
  
  // Check if it's today
  const today = new Date();
  const isToday = date.getDate() === today.getDate() &&
                  date.getMonth() === today.getMonth() &&
                  date.getFullYear() === today.getFullYear();
  
  if (isToday) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Check if it's yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.getDate() === yesterday.getDate() &&
                      date.getMonth() === yesterday.getMonth() &&
                      date.getFullYear() === yesterday.getFullYear();
  
  if (isYesterday) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Otherwise, show full date
  return date.toLocaleString([], {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
