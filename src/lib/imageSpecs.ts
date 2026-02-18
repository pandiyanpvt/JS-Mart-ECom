/**
 * Image upload specs for JS Mart Storefront & Admin.
 * Same dimensions and file size limits as Admin for consistent display.
 */

export const IMAGE_SPECS = {
  /** Homepage banners / promotions (Level 1–5) */
  banners: {
    width: 1920,
    height: 600,
    minWidth: 800,
    minHeight: 250,
    maxFileSizeBytes: 2 * 1024 * 1024, // 2 MB
    maxFileSizeLabel: "2 MB",
    aspectRatio: "16:5 (e.g. 1920×600)",
    formats: "JPG, PNG, JPEG, WebP",
  },

  /** Product images (listing & detail) */
  productImages: {
    width: 800,
    height: 800,
    minWidth: 400,
    minHeight: 400,
    maxFileSizeBytes: 1 * 1024 * 1024, // 1 MB
    maxFileSizeLabel: "1 MB",
    aspectRatio: "1:1 (square, e.g. 800×800)",
    formats: "JPG, PNG, JPEG, WebP",
  },

  /** Category images */
  categoryImages: {
    width: 400,
    height: 400,
    minWidth: 200,
    minHeight: 200,
    maxFileSizeBytes: 512 * 1024, // 500 KB
    maxFileSizeLabel: "500 KB",
    aspectRatio: "1:1 (e.g. 400×400)",
    formats: "JPG, PNG, JPEG, WebP",
  },

  /** Brand logos */
  brandImages: {
    width: 400,
    height: 200,
    minWidth: 200,
    minHeight: 100,
    maxFileSizeBytes: 512 * 1024, // 500 KB
    maxFileSizeLabel: "500 KB",
    aspectRatio: "2:1 (e.g. 400×200)",
    formats: "JPG, PNG, JPEG, WebP",
  },

  /** Profile / avatar */
  profileAvatar: {
    width: 400,
    height: 400,
    minWidth: 100,
    minHeight: 100,
    maxFileSizeBytes: 512 * 1024, // 500 KB
    maxFileSizeLabel: "500 KB",
    aspectRatio: "1:1 (e.g. 400×400)",
    formats: "JPG, PNG, JPEG, WebP",
  },

  /** Shop logo (settings) */
  logo: {
    width: 400,
    height: 150,
    minWidth: 200,
    minHeight: 80,
    maxFileSizeBytes: 512 * 1024, // 500 KB
    maxFileSizeLabel: "500 KB",
    aspectRatio: "~2.6:1 (e.g. 400×150)",
    formats: "JPG, PNG, JPEG, WebP",
  },

  /** Offer / campaign banner */
  offerBanner: {
    width: 800,
    height: 400,
    minWidth: 400,
    minHeight: 200,
    maxFileSizeBytes: 1 * 1024 * 1024, // 1 MB
    maxFileSizeLabel: "1 MB",
    aspectRatio: "2:1 (e.g. 800×400)",
    formats: "JPG, PNG, JPEG, WebP",
  },

  /** Stock / evidence photo */
  evidencePhoto: {
    width: 1200,
    height: 800,
    maxFileSizeBytes: 2 * 1024 * 1024, // 2 MB
    maxFileSizeLabel: "2 MB",
    formats: "JPG, PNG, JPEG, WebP",
  },
} as const;

export type ImageSpecKey = keyof typeof IMAGE_SPECS;

/**
 * Validate file size against spec.
 */
export function validateImageFileSize(
  file: File,
  specKey: ImageSpecKey
): { valid: boolean; message?: string } {
  const spec = IMAGE_SPECS[specKey];
  if (!spec || !("maxFileSizeBytes" in spec)) return { valid: true };
  const maxBytes = (spec as { maxFileSizeBytes?: number }).maxFileSizeBytes;
  if (!maxBytes) return { valid: true };
  if (file.size > maxBytes) {
    const label = (spec as { maxFileSizeLabel?: string }).maxFileSizeLabel ?? "limit";
    return {
      valid: false,
      message: `File size must be under ${label}. Current: ${(file.size / 1024).toFixed(0)} KB`,
    };
  }
  return { valid: true };
}

/**
 * Validate image dimensions (optional; use after loading image in browser).
 */
export function validateImageDimensions(
  width: number,
  height: number,
  specKey: ImageSpecKey
): { valid: boolean; message?: string } {
  const spec = IMAGE_SPECS[specKey] as { minWidth?: number; minHeight?: number; aspectRatio?: string };
  if (!spec?.minWidth) return { valid: true };
  if (width < spec.minWidth! || height < spec.minHeight!) {
    return {
      valid: false,
      message: `Recommended min size: ${spec.minWidth}×${spec.minHeight} px. Use ${spec.aspectRatio ?? "recommended"} for best display.`,
    };
  }
  return { valid: true };
}
