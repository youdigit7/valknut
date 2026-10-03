/**
 * VALKNUT Security & Input Sanitization Utilities
 * Implements Defense-in-Depth against XSS, HTML injection, and insecure direct object reference.
 * Enforces PCI-DSS compliance principles (zero local card data storage).
 */

/**
 * Escapes dangerous HTML entities to prevent Cross-Site Scripting (XSS)
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Strips all script tags, event handlers, and javascript: protocols from strings
 */
export function stripScriptTags(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
}

/**
 * Sanitizes search queries to prevent ReDoS (Regular Expression Denial of Service)
 * and special characters abuse
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query || typeof query !== 'string') return '';
  // Remove control characters and limit length
  return query
    .replace(/[^\w\s\-_+.,#@/]/gi, '')
    .slice(0, 100)
    .trim();
}

/**
 * Sanitizes bespoke custom studio text (removes malicious unicode, scripts, and limits length)
 */
export function sanitizeCustomStudioText(text: string, maxLength = 32): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/[<>{}\\]/g, '') // remove brackets
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // strip control chars
    .slice(0, maxLength);
}

/**
 * Validates Sri Lankan mobile phone formats (+94 7X XXX XXXX or 07X XXX XXXX)
 */
export function validateSriLankanPhone(phone: string): boolean {
  if (!phone) return false;
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  const slPhoneRegex = /^(?:\+94|0094|0)?7[0-9]{8}$/;
  return slPhoneRegex.test(cleanPhone);
}

/**
 * Validates standard email address format
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim()) && email.length <= 254;
}

/**
 * PCI-DSS Compliance Enforcement Check:
 * Ensures application never stores raw Primary Account Numbers (PAN), CVVs, or expiration dates.
 */
export function purgeCreditCardDataFromPayload(payload: Record<string, any>): Record<string, any> {
  const safePayload = { ...payload };
  const forbiddenKeys = [
    'cardNumber',
    'card_number',
    'pan',
    'cvv',
    'cvc',
    'securityCode',
    'expMonth',
    'expYear',
    'expiry',
    'creditCard'
  ];

  for (const key of Object.keys(safePayload)) {
    if (forbiddenKeys.some((f) => key.toLowerCase().includes(f))) {
      delete safePayload[key];
    }
  }

  return safePayload;
}

/**
 * Validates allowed MIME types and max size for customer artwork uploads
 */
export function validateArtworkUpload(file: File, maxSizeBytes = 15 * 1024 * 1024): { valid: boolean; error?: string } {
  const allowedMimeTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/svg+xml'
  ];

  if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Invalid file format. Only high-res PNG, JPG, WEBP, and vector SVG files are accepted.'
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds the 15MB limit (File is ${(file.size / (1024 * 1024)).toFixed(1)}MB).`
    };
  }

  return { valid: true };
}
