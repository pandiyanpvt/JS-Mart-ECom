/**
 * Fallback when no image is uploaded.
 * File: public/images/image_emty.png (same asset as admin).
 */
export const EMPTY_IMAGE_SRC = "/images/image_emty.png";

export function resolveImageSrc(url: string | null | undefined): string {
    if (url == null) return EMPTY_IMAGE_SRC;
    const s = String(url).trim();
    if (!s) return EMPTY_IMAGE_SRC;
    if (s.startsWith("http") || s.startsWith("//") || s.startsWith("data:")) return s;
    if (s.startsWith("/")) return s;
    return `/${s}`;
}
