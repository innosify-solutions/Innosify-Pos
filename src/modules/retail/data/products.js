/**
 * Retail catalog — imported from the Takshi master list
 * (E:\takshi ds v2\src\modules\retail\data\products.data.js).
 * `gradient` is the master-list Tailwind swatch; `swatch` is the same
 * look as inline CSS for the photo-fallback card. Do not edit here;
 * update the master list and re-import.
 */
export const categories = [
  { id: 'all', name: 'All' },
  { id: 'Kanjivaram', name: 'Kanjivaram' },
  { id: 'Green Gold', name: 'Green Gold' },
  { id: 'Banarasi Silk', name: 'Banarasi Silk' },
  { id: 'Soft Silk', name: 'Soft Silk' },
  { id: 'Cotton Saree', name: 'Cotton Saree' },
  { id: 'Saree', name: 'Saree' },
  { id: 'Mysore Silk', name: 'Mysore Silk' },
  { id: 'Organza', name: 'Organza' },
  { id: 'Linen', name: 'Linen' },
];

export const products = [
  { id: 'p1', name: 'Kanjivaram Silk Saree — Red Gold Zari', sku: 'KK5000401', barcode: 'KK5000401', price: 245, category: 'Kanjivaram', stock: 20, image: '/images/products/p1.jpg', gradient: 'from-red-700 to-amber-600', swatch: 'linear-gradient(135deg,#b91c1c,#d97706)' },
  { id: 'p2', name: 'Kanjivaram Silk Saree — Green Gold Zari', sku: 'KK5000402', barcode: 'KK5000402', price: 320, category: 'Green Gold', stock: 5, image: '/images/products/p2.jpg', gradient: 'from-emerald-700 to-lime-600', swatch: 'linear-gradient(135deg,#047857,#65a30d)' },
  { id: 'p3', name: 'Banarasi Silk Saree', sku: 'BSL00401', barcode: 'BSL00401', price: 935, category: 'Banarasi Silk', stock: 66, image: '/images/products/p3.jpg', gradient: 'from-orange-600 to-rose-700', swatch: 'linear-gradient(135deg,#ea580c,#be123c)' },
  { id: 'p4', name: 'Soft Silk Saree', sku: 'SSL00402', barcode: 'SSL00402', price: 435, category: 'Soft Silk', stock: 23, image: '/images/products/p4.jpg', gradient: 'from-pink-500 to-fuchsia-700', swatch: 'linear-gradient(135deg,#ec4899,#a21caf)' },
  { id: 'p5', name: 'Cotton Saree', sku: 'COT00308', barcode: 'COT00308', price: 330, category: 'Cotton Saree', stock: 12, image: '/images/products/p5.jpg', gradient: 'from-sky-600 to-indigo-700', swatch: 'linear-gradient(135deg,#0284c7,#4338ca)' },
  { id: 'p6', name: 'Chanderi Saree', sku: 'FS500322', barcode: 'FS500322', price: 350, category: 'Cotton Saree', stock: 6, image: '/images/products/p6.webp', gradient: 'from-rose-400 to-orange-500', swatch: 'linear-gradient(135deg,#fb7185,#f97316)' },
  { id: 'p7', name: 'Chanderi Saree', sku: 'HK500304', barcode: 'HK500304', price: 300, category: 'Saree', stock: 20, image: '/images/products/p7.jpg', gradient: 'from-lime-600 to-emerald-700', swatch: 'linear-gradient(135deg,#65a30d,#047857)' },
  { id: 'p8', name: 'Mysore Silk Saree', sku: 'MYS00501', barcode: 'MYS00501', price: 520, category: 'Mysore Silk', stock: 15, image: '/images/products/p8.jpg', gradient: 'from-violet-600 to-purple-800', swatch: 'linear-gradient(135deg,#7c3aed,#6b21a8)' },
  { id: 'p9', name: 'Organza Saree', sku: 'ORG00601', barcode: 'ORG00601', price: 275, category: 'Saree', stock: 0, image: '/images/products/p9.jpg', gradient: 'from-teal-500 to-cyan-700', swatch: 'linear-gradient(135deg,#14b8a6,#0e7490)' },
  { id: 'p10', name: 'Linen Saree', sku: 'LIN00702', barcode: 'LIN00702', price: 310, category: 'Linen', stock: 9, image: '/images/products/p10.jpg', gradient: 'from-stone-500 to-amber-700', swatch: 'linear-gradient(135deg,#78716c,#b45309)' },
];
