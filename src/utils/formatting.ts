/**
 * Formatting Utilities
 * 
 * Functions for formatting dates, numbers, and text for display.
 * These utilities provide consistent formatting across the application.
 * 
 * Requirements: 8.1, 8.2, 8.3
 */

/**
 * Format a date to a localized string
 * 
 * @param date - Date to format (Date object or ISO string)
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 * 
 * @example
 * ```tsx
 * formatDate(new Date('2024-01-15'));
 * // "January 15, 2024"
 * 
 * formatDate(new Date('2024-01-15'), { dateStyle: 'short' });
 * // "1/15/24"
 * ```
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'long' }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Format a date to a relative time string (e.g., "2 days ago")
 * 
 * @param date - Date to format (Date object or ISO string)
 * @returns Relative time string
 * 
 * @example
 * ```tsx
 * formatRelativeTime(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000));
 * // "2 days ago"
 * 
 * formatRelativeTime(new Date(Date.now() + 3 * 60 * 60 * 1000));
 * // "in 3 hours"
 * ```
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
    if (count >= 1) {
      const plural = count !== 1 ? 's' : '';
      if (diffInSeconds < 0) {
        return `in ${count} ${interval.label}${plural}`;
      }
      return `${count} ${interval.label}${plural} ago`;
    }
  }
  
  return 'just now';
}

/**
 * Format a number with thousands separators
 * 
 * @param num - Number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string
 * 
 * @example
 * ```tsx
 * formatNumber(1234567);
 * // "1,234,567"
 * 
 * formatNumber(1234.5678, 2);
 * // "1,234.57"
 * ```
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format a number as a percentage
 * 
 * @param value - Number to format (0-1 or 0-100)
 * @param decimals - Number of decimal places (default: 0)
 * @param isDecimal - Whether the value is in decimal form (0-1) or percentage form (0-100)
 * @returns Formatted percentage string
 * 
 * @example
 * ```tsx
 * formatPercentage(0.856, 1, true);
 * // "85.6%"
 * 
 * formatPercentage(85.6, 1, false);
 * // "85.6%"
 * ```
 */
export function formatPercentage(
  value: number,
  decimals: number = 0,
  isDecimal: boolean = true
): string {
  const percentage = isDecimal ? value * 100 : value;
  return `${formatNumber(percentage, decimals)}%`;
}

/**
 * Truncate text to a maximum length with ellipsis
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @param ellipsis - String to append when truncated (default: "...")
 * @returns Truncated text
 * 
 * @example
 * ```tsx
 * truncateText('This is a very long text', 10);
 * // "This is a..."
 * 
 * truncateText('Short', 10);
 * // "Short"
 * ```
 */
export function truncateText(
  text: string,
  maxLength: number,
  ellipsis: string = '...'
): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Capitalize the first letter of a string
 * 
 * @param text - Text to capitalize
 * @returns Text with first letter capitalized
 * 
 * @example
 * ```tsx
 * capitalize('hello world');
 * // "Hello world"
 * ```
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert text to title case (capitalize each word)
 * 
 * @param text - Text to convert
 * @returns Text in title case
 * 
 * @example
 * ```tsx
 * toTitleCase('hello world from typescript');
 * // "Hello World From Typescript"
 * ```
 */
export function toTitleCase(text: string): string {
  if (!text) return text;
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Format a file size in bytes to a human-readable string
 * 
 * @param bytes - File size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string
 * 
 * @example
 * ```tsx
 * formatFileSize(1024);
 * // "1.00 KB"
 * 
 * formatFileSize(1536000);
 * // "1.46 MB"
 * ```
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}
