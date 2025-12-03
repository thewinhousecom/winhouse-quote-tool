// ============================================
// WINHOUSE QUOTE TOOL - UTILITY FUNCTIONS
// ============================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in VND
 */
export function formatCurrency(amount: number, showUnit = true): string {
  const formatted = new Intl.NumberFormat('vi-VN').format(amount);
  return showUnit ? `${formatted} ₫` : formatted;
}

/**
 * Format currency in millions (triệu)
 */
export function formatMillions(amount: number): string {
  const millions = amount / 1000000;
  if (millions >= 1) {
    return `${millions.toFixed(millions % 1 === 0 ? 0 : 1)}tr`;
  }
  return formatCurrency(amount);
}

/**
 * Generate unique quote number
 */
export function generateQuoteNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `WH${year}${month}-${random}`;
}

/**
 * Calculate valid until date (30 days from now)
 */
export function getValidUntilDate(days = 30): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Format date in Vietnamese
 */
export function formatDateVi(date: Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as 0xxx xxx xxx
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
}

/**
 * Validate Vietnamese phone number
 */
export function isValidVietnamesePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  // Vietnamese phone: starts with 0, 10 digits total
  return /^0[35789]\d{8}$/.test(cleaned);
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Pluralize Vietnamese (simple version)
 */
export function pluralizeVi(count: number, singular: string): string {
  return `${count} ${singular}`;
}

/**
 * Get greeting based on time of day (Vietnamese)
 */
export function getGreetingVi(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Chào buổi sáng';
  if (hour < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
}

/**
 * Format estimated days to readable string
 */
export function formatEstimatedTime(days: number): string {
  if (days <= 0) return 'Ngay lập tức';
  if (days === 1) return '1 ngày';
  if (days < 7) return `${days} ngày`;
  
  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;
  
  if (remainingDays === 0) {
    return weeks === 1 ? '1 tuần' : `${weeks} tuần`;
  }
  
  return `${weeks} tuần ${remainingDays} ngày`;
}

/**
 * Scroll to element smoothly
 */
export function scrollToElement(elementId: string, offset = 0): void {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if we're on client side
 */
export const isClient = typeof window !== 'undefined';

/**
 * Check if we're on server side
 */
export const isServer = typeof window === 'undefined';
