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
