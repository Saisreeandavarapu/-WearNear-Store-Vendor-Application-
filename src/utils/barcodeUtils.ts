import { Product, ProductVariant } from '../types';

/**
 * Calculates standard EAN-13 check digit (Mod 10 with alternating weights 1 and 3)
 */
export function calculateEan13CheckDigit(twelveDigits: string): number {
  if (twelveDigits.length !== 12) return 0;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(twelveDigits[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const mod = sum % 10;
  return mod === 0 ? 0 : 10 - mod;
}

/**
 * Generates a unique, valid EAN-13 barcode
 * Uses prefix 890 (GS1 India prefix), followed by 9 random digits and calculated check digit.
 */
export function generateUniqueBarcode(existingBarcodes: string[] = []): string {
  let attempts = 0;
  while (attempts < 100) {
    // 890 prefix + 9 random digits = 12 digits
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000).toString();
    const twelve = `890${randomDigits}`;
    const checkDigit = calculateEan13CheckDigit(twelve);
    const candidate = `${twelve}${checkDigit}`;

    if (!existingBarcodes.includes(candidate)) {
      return candidate;
    }
    attempts++;
  }
  // Fallback timestamp based Code-128
  return `890${Date.now().toString().slice(-10)}`;
}

/**
 * Validates a barcode string and identifies its format
 */
export function validateBarcodeFormat(barcode: string): {
  valid: boolean;
  format: 'EAN-13' | 'EAN-8' | 'UPC-A' | 'UPC-E' | 'CODE128' | 'CODE39' | 'QR' | 'UNKNOWN';
  error?: string;
} {
  const clean = barcode.trim();
  if (!clean) {
    return { valid: false, format: 'UNKNOWN', error: 'Barcode cannot be empty.' };
  }

  // Pure numeric formats
  if (/^\d{13}$/.test(clean)) {
    const check = calculateEan13CheckDigit(clean.slice(0, 12));
    if (parseInt(clean[12], 10) === check) {
      return { valid: true, format: 'EAN-13' };
    }
    return { valid: true, format: 'EAN-13', error: 'Note: Check digit checksum mismatch.' };
  }

  if (/^\d{8}$/.test(clean)) {
    return { valid: true, format: 'EAN-8' };
  }

  if (/^\d{12}$/.test(clean)) {
    return { valid: true, format: 'UPC-A' };
  }

  if (/^\d{6}$/.test(clean)) {
    return { valid: true, format: 'UPC-E' };
  }

  // Alphanumeric standard barcode
  if (/^[A-Za-z0-9\-._/]{4,32}$/.test(clean)) {
    return { valid: true, format: 'CODE128' };
  }

  return {
    valid: false,
    format: 'UNKNOWN',
    error: 'Unsupported barcode format. Please use EAN-13, EAN-8, UPC, or Code 128.'
  };
}

/**
 * Finds a product and variant by barcode or SKU
 */
export function findProductByBarcode(
  barcodeOrSku: string,
  products: Product[]
): {
  product: Product;
  variant?: ProductVariant;
  matchType: 'BARCODE' | 'SKU';
} | null {
  const query = barcodeOrSku.trim().toLowerCase();
  if (!query) return null;

  for (const product of products) {
    // 1. Check product level barcode
    if (product.barcode && product.barcode.trim().toLowerCase() === query) {
      return { product, matchType: 'BARCODE' };
    }

    // 2. Check variants barcode
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        if (variant.barcode && variant.barcode.trim().toLowerCase() === query) {
          return { product, variant, matchType: 'BARCODE' };
        }
      }
    }

    // 3. Fallback: match by variant SKU
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        if (variant.sku && variant.sku.trim().toLowerCase() === query) {
          return { product, variant, matchType: 'SKU' };
        }
      }
    }

    // 4. Match by product SKU
    if (product.sku && product.sku.trim().toLowerCase() === query) {
      return { product, matchType: 'SKU' };
    }
  }

  return null;
}

/**
 * Checks if a barcode is already assigned to another variant or product in the store.
 * Ignores the variant currently being edited.
 */
export function checkDuplicateBarcode(
  barcode: string,
  currentVariantId: string | null,
  currentProductId: string | null,
  products: Product[]
): {
  isDuplicate: boolean;
  conflictProduct?: Product;
  conflictVariant?: ProductVariant;
} {
  const clean = barcode.trim().toLowerCase();
  if (!clean) return { isDuplicate: false };

  for (const product of products) {
    // Check product main barcode
    if (product.barcode && product.barcode.trim().toLowerCase() === clean) {
      if (product.id !== currentProductId || currentVariantId !== null) {
        return { isDuplicate: true, conflictProduct: product };
      }
    }

    // Check variants
    if (product.variants) {
      for (const variant of product.variants) {
        if (variant.barcode && variant.barcode.trim().toLowerCase() === clean) {
          if (variant.id !== currentVariantId) {
            return {
              isDuplicate: true,
              conflictProduct: product,
              conflictVariant: variant
            };
          }
        }
      }
    }
  }

  return { isDuplicate: false };
}

/**
 * Collects all barcodes currently in use across all products
 */
export function getAllExistingBarcodes(products: Product[]): string[] {
  const barcodes: string[] = [];
  products.forEach((p) => {
    if (p.barcode) barcodes.push(p.barcode);
    p.variants?.forEach((v) => {
      if (v.barcode) barcodes.push(v.barcode);
    });
  });
  return barcodes;
}

/**
 * Plays a pleasant synthetic beep tone on barcode scan success (Web Audio API)
 */
export function playScanSuccessSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Two-tone quick retail chime: 1200Hz then 1760Hz
    osc.frequency.setValueAtTime(1320, ctx.currentTime);
    osc.frequency.setValueAtTime(1760, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  } catch {
    // Audio synthesis not permitted or unavailable
  }
}

/**
 * Plays an error buzz tone for barcode error / not found (Web Audio API)
 */
export function playScanErrorSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.setValueAtTime(180, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Audio synthesis not permitted or unavailable
  }
}
