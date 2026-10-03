/**
 * Verified product image registry.
 * Image availability is the single source of truth.
 * Products whose images are missing, broken, or not in this list MUST BE REMOVED.
 */

export const VALID_PRODUCT_IMAGE_PATHS = new Set([
  // 1. Fresh Flowers (7 verified Bengaluru blooms)
  '/assets/products/fresh-flowers-roses.jpg',
  '/assets/products/fresh-flowers-lilies.jpg',
  '/assets/products/fresh-flowers-jasmine.jpg',
  '/assets/products/fresh-flowers-marigold.jpg',
  '/assets/products/fresh-flowers-kanakambaram.jpg',
  '/assets/products/fresh-flowers-chrysanthemum.jpg',
  '/assets/products/fresh-flowers-gerbera.jpg',

  // 2. Plants (7 verified potted plants)
  '/assets/products/plants-money-plant.jpg',
  '/assets/products/plants-snake-plant.jpg',
  '/assets/products/plants-hibiscus-plant.jpg',
  '/assets/products/plants-aloe-vera-plant.jpg',
  '/assets/products/plants-peace-lily.jpg',
  '/assets/products/plants-areca-palm.jpg',
  '/assets/products/plants-jade-plant.jpg',

  // 3. Bouquets (7 verified hand-tied bouquets)
  '/assets/products/bouquets-classic-red-rose.jpg',
  '/assets/products/bouquets-pink-rose.jpg',
  '/assets/products/bouquets-lily-elegance.jpg',
  '/assets/products/bouquets-mixed-flower.jpg',
  '/assets/products/bouquets-white-green.jpg',
  '/assets/products/bouquets-pastel-flower.jpg',
  '/assets/products/bouquets-sunshine-yellow.jpg',

  // 4. Seeds (7 verified packaged seeds)
  '/assets/products/seeds-rose-seeds.jpg',
  '/assets/products/seeds-marigold-seeds.jpg',
  '/assets/products/seeds-sunflower-seeds.jpg',
  '/assets/products/seeds-jasmine-seeds.jpg',
  '/assets/products/seeds-hibiscus-seeds.jpg',
  '/assets/products/seeds-tomato-seeds.jpg',
  '/assets/products/seeds-basil-seeds.jpg',

  // 5. Decor (4 verified botanical decor items)
  '/assets/products/decor-table-decor.jpg',
  '/assets/products/decor-festive-decor.jpg',
  '/assets/products/decor-hanging-decor.jpg',
  '/assets/products/decor-living-wall-decor.jpg',

  // 6. Gift Combos (7 verified artisanal gift combos)
  '/assets/products/gift-combos-flowers-cake.jpg',
  '/assets/products/gift-combos-flowers-teddy-bear.jpg',
  '/assets/products/gift-combos-flowers-chocolates.jpg',
  '/assets/products/gift-combos-flowers-cake-chocolates.jpg',
  '/assets/products/gift-combos-flowers-teddy-chocolates.jpg',
  '/assets/products/gift-combos-flowers-candle.jpg',
  '/assets/products/gift-combos-flowers-greeting-card.jpg'
]);

/**
 * Returns true if the product has a valid, existing image.
 */
export function hasValidProductImage(product) {
  if (!product) return false;
  const img = product.image || product.imageUrl;
  if (!img || typeof img !== 'string') return false;
  return VALID_PRODUCT_IMAGE_PATHS.has(img.trim());
}

/**
 * Strictly filters an array of products to KEEP ONLY products with valid images.
 * Removes products with missing, broken, placeholder, or blank images.
 */
export function filterProductsWithValidImages(products) {
  if (!Array.isArray(products)) return [];
  return products.filter(hasValidProductImage);
}
