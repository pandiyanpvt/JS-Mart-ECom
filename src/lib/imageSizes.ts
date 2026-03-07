/**
 * Recommended image dimensions for JS Mart storefront.
 * Use these when adding or replacing images. Admin (JS_Mart-Admin) uses matching specs in lib/imageSpecs.js.
 */

export const IMAGE_SIZES = {
  /** Hero / header carousel (homepage). HeroSection: aspect-[16/5], max-h 600px */
  heroBanner: { width: 1920, height: 600, aspect: "16:5" },

  /** Page headers (shop, offers, about, contact, membership). aspect-[16/5], min-h 180px max-h 360px */
  pageHeader: { width: 1920, height: 600, aspect: "16:5" },

  /** Mid-page promo strip cards (Level 3 & 4). MiddleBannerSection: aspect-[3/2], same as category strip */
  midPageBanner: { width: 600, height: 400, aspect: "3:2" },

  /** Footer promotional strip (Level 5). FooterBannerSection: h 200–350px, full width */
  footerBanner: { width: 1920, height: 420, aspect: "~32:7" },

  /** Category banner (category strip & category-banners-section). aspect-[3/2], card 280–320px wide */
  categoryBanner: { width: 600, height: 400, aspect: "3:2" },

  /** Category icon (featured categories grid). 1:1 */
  categoryIcon: { width: 400, height: 400, aspect: "1:1" },

  /** Offer card banner (Best Deals). OfferCardSection: h-40 desktop, 2:1 card image area */
  offerBanner: { width: 800, height: 400, aspect: "2:1" },
} as const;
