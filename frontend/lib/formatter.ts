/**
 * Format a number as Indonesian Rupiah
 * @param amount - Amount to format
 * @param withSymbol - Whether to include the Rp symbol
 * @param abbreviated - Whether to abbreviate large numbers (e.g., 1.2 jt)
 * @returns Formatted rupiah string
 */
export const formatRupiah = (amount: number, withSymbol = true, abbreviated = false): string => {
  if (amount === 0) return withSymbol ? 'Rp0' : '0';
  
  // For abbreviated format (useful for charts)
  if (abbreviated) {
    if (amount >= 1000000000) {
      return `${withSymbol ? 'Rp' : ''}${(amount / 1000000000).toFixed(1)} M`;
    } else if (amount >= 1000000) {
      return `${withSymbol ? 'Rp' : ''}${(amount / 1000000).toFixed(1)} jt`;
    } else if (amount >= 1000) {
      return `${withSymbol ? 'Rp' : ''}${(amount / 1000).toFixed(0)} rb`;
    }
  }
  
  // Standard format
  return (withSymbol ? 'Rp' : '') +
    amount.toLocaleString('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
};

/**
 * Format a date nicely
 * @param dateString - Date string or Date object
 * @param withTime - Whether to include time
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | Date | null, withTime = true): string => {
  if (!dateString) return 'N/A';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (withTime) {
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a date to a time string
 */
export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Truncate a string if it's longer than maxLength
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

/**
 * Format a chat message timestamp to a relative time
 */
export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();

  // If it's today, just show the time
  if (date.toDateString() === now.toDateString()) {
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  // If it's yesterday, show "Yesterday"
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  // If it's this week, show the day name
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  if (date > oneWeekAgo) {
    return new Intl.DateTimeFormat("id-ID", { weekday: "long" }).format(date);
  }

  // Otherwise show the date
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Get user's initials from their name
 */
export function getInitials(name: string): string {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Format percentage value
 * @param value - Percentage value
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals = 1): string => {
  if (isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format large numbers with K, M, B suffixes
 * @param num - Number to format
 * @returns Formatted number string
 */
export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Format duration in milliseconds to human readable format
 * @param ms - Duration in milliseconds
 * @returns Human readable duration
 */
export const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Calculate growth percentage between two values
 * @param current - Current value
 * @param previous - Previous value
 * @returns Growth percentage
 */
export const calculateGrowthPercentage = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Format status for display
 * @param status - Status string
 * @returns Formatted status
 */
export const formatStatus = (status: string): string => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Generate color based on string hash
 * @param str - Input string
 * @returns Hex color code
 */
export const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};
