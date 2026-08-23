/**
 * Security Utilities
 * Centralized utility functions for frontend security: validation, sanitization, etc.
 */

/**
 * Sanitizes input text to prevent basic XSS by escaping HTML entities.
 * (Note: React does this automatically for text nodes, but this is useful for pre-processing or logs).
 * @param {string} str 
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Validates email format using a strict regex.
 * @param {string} email 
 * @returns {boolean} True if valid email format
 */
export const validateEmail = (email) => {
  if (!email) return false;
  // RFC 5322 official standard regex for email
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
};

/**
 * Checks if a string exceeds a maximum length.
 * @param {string} str 
 * @param {number} maxLength 
 * @returns {boolean} True if valid (within length)
 */
export const validateLength = (str, maxLength) => {
  if (str === null || str === undefined) return true;
  return String(str).length <= maxLength;
};

/**
 * Validates a file for secure upload.
 * Checks MIME type and File Size.
 * @param {File} file - The file object from input type="file"
 * @param {number} maxSizeMB - Maximum allowed size in Megabytes
 * @param {Array<string>} allowedTypes - Array of allowed MIME types (e.g. ['image/jpeg', 'image/png'])
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export const validateFileSecurity = (
  file, 
  maxSizeMB = 5, 
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
) => {
  if (!file) {
    return { isValid: false, error: 'No file provided.' };
  }

  // 1. Check File Size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { isValid: false, error: `File size exceeds the maximum limit of ${maxSizeMB}MB.` };
  }

  // 2. Check MIME Type
  if (allowedTypes && allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: `Invalid file type: ${file.type || 'unknown'}. Allowed types: ${allowedTypes.join(', ')}` 
    };
  }

  // 3. Optional: Check extension consistency (basic check against spoofed extensions)
  const extension = file.name ? file.name.split('.').pop().toLowerCase() : '';
  const typeMap = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/jpg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/webp': ['webp'],
    'application/pdf': ['pdf'],
    'application/x-pdf': ['pdf']
  };

  const expectedExtensions = typeMap[file.type];
  if (expectedExtensions && !expectedExtensions.includes(extension)) {
    return { isValid: false, error: 'File extension does not match its content type. Possible spoofing attempt.' };
  }

  return { isValid: true, error: null };
};
