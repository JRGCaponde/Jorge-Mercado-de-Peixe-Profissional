
import { UserRole } from '../types';

/**
 * Masks sensitive information like emails or phone numbers
 * if the user role is not authorized (Staff can only see masked data).
 */
export const maskPII = (value: string, role: UserRole): string => {
  if (role === UserRole.ADMIN) return value;
  
  // Phone masking: 923***123
  if (/^\d{9,12}$/.test(value.replace(/\D/g, ''))) {
    return value.slice(0, 3) + '***' + value.slice(-3);
  }
  
  // Email masking: a***@domain.com
  if (value.includes('@')) {
    const [name, domain] = value.split('@');
    return name[0] + '***@' + domain;
  }
  
  return '***';
};
