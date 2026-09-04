/**
 * Takshi — saree catalog (mock data).
 * Every product carries a photo `image` plus a gradient `swatch`
 * used as offline fallback if the photo cannot load.
 */
const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=500&q=70`;

export const categories = [
  { id: 'all', name: 'All' },
  { id: 'silk', name: 'Silk' },
  { id: 'cotton', name: 'Cotton' },
  { id: 'banarasi', name: 'Banarasi' },
  { id: 'kanjivaram', name: 'Kanjivaram' },
  { id: 'chiffon', name: 'Chiffon' },
  { id: 'georgette', name: 'Georgette' },
  { id: 'linen', name: 'Linen' },
];

export const products = [
  {
    id: 's1', name: 'Banarasi Silk Saree — Royal Red', sku: '300001', barcode: '300001',
    price: 5499, category: 'banarasi', fabric: 'Pure Silk with Gold Zari', stock: 5,
    image: img('photo-1610030469983-98e550d6193c'),
    swatch: 'linear-gradient(135deg,#7f1d1d 0%,#dc2626 55%,#7f1d1d 100%)',
  },
  {
    id: 's2', name: 'Kanjivaram Silk Saree — Temple Green', sku: '300002', barcode: '300002',
    price: 7999, category: 'kanjivaram', fabric: 'Pure Mulberry Silk', stock: 12,
    image: img('photo-1583391733956-3750e0ff4e8b'),
    swatch: 'linear-gradient(135deg,#052e16 0%,#15803d 55%,#052e16 100%)',
  },
  {
    id: 's3', name: 'Chanderi Cotton Saree — Sky Blue', sku: '300003', barcode: '300003',
    price: 1899, category: 'cotton', fabric: 'Chanderi Cotton with Zari Border', stock: 40,
    image: img('photo-1617627143750-d86bc21e42bb'),
    swatch: 'linear-gradient(135deg,#0c4a6e 0%,#38bdf8 55%,#0c4a6e 100%)',
  },
  {
    id: 's4', name: 'Chiffon Saree — Blush Pink', sku: '300004', barcode: '300004',
    price: 1499, category: 'chiffon', fabric: 'Soft Chiffon with Sequin Work', stock: 60,
    image: img('photo-1622122201714-77da0ca8e5d2'),
    swatch: 'linear-gradient(135deg,#831843 0%,#f472b6 55%,#831843 100%)',
  },
  {
    id: 's5', name: 'Georgette Saree — Wine Maroon', sku: '300005', barcode: '300005',
    price: 2299, category: 'georgette', fabric: 'Georgette with Stone Border', stock: 35,
    image: img('photo-1594633312681-425c7b97ccd1'),
    swatch: 'linear-gradient(135deg,#4c0519 0%,#be123c 55%,#4c0519 100%)',
  },
  {
    id: 's6', name: 'Tussar Silk Saree — Golden Beige', sku: '300006', barcode: '300006',
    price: 3999, category: 'silk', fabric: 'Handloom Tussar Silk', stock: 8,
    image: img('photo-1606902965551-dce093cda6e7'),
    swatch: 'linear-gradient(135deg,#713f12 0%,#eab308 55%,#713f12 100%)',
  },
  {
    id: 's7', name: 'Linen Saree — Ivory White', sku: '300007', barcode: '300007',
    price: 2599, category: 'linen', fabric: 'Pure Linen with Contrast Pallu', stock: 25,
    image: img('photo-1581044777550-4cfa60707c03'),
    swatch: 'linear-gradient(135deg,#57534e 0%,#fefce8 60%,#a8a29e 100%)',
  },
  {
    id: 's8', name: 'Bandhani Saree — Festive Orange', sku: '300008', barcode: '300008',
    price: 2799, category: 'cotton', fabric: 'Bandhej Cotton with Mirror Work', stock: 30,
    image: img('photo-1610189844800-c1d4b8d0dc2c'),
    swatch: 'linear-gradient(135deg,#7c2d12 0%,#fb923c 55%,#7c2d12 100%)',
  },
  {
    id: 's9', name: 'Mysore Silk Saree — Royal Purple', sku: '300009', barcode: '300009',
    price: 6499, category: 'silk', fabric: 'Mysore Silk with Gold Jari', stock: 10,
    image: img('photo-1614093302611-8efc9de12511'),
    swatch: 'linear-gradient(135deg,#3b0764 0%,#a855f7 55%,#3b0764 100%)',
  },
  {
    id: 's10', name: 'Organza Saree — Pastel Mint', sku: '300010', barcode: '300010',
    price: 3199, category: 'chiffon', fabric: 'Organza with Floral Print', stock: 22,
    image: img('photo-1602810318383-e386cc2a3ccf'),
    swatch: 'linear-gradient(135deg,#134e4a 0%,#5eead4 55%,#134e4a 100%)',
  },
  {
    id: 's11', name: 'Ajrakh Cotton Saree — Indigo', sku: '300011', barcode: '300011',
    price: 1999, category: 'cotton', fabric: 'Ajrakh Hand-Block Cotton', stock: 45,
    image: img('photo-1605518216938-7c31b7b14ad0'),
    swatch: 'linear-gradient(135deg,#172554 0%,#6366f1 55%,#172554 100%)',
  },
  {
    id: 's12', name: 'Patola Silk Saree — Multicolor', sku: '300012', barcode: '300012',
    price: 8999, category: 'silk', fabric: 'Double-Ikat Patola Silk', stock: 4,
    image: img('photo-1583939003579-730e3918a45a'),
    swatch: 'linear-gradient(135deg,#7c2d12 0%,#db2777 35%,#4f46e5 70%,#7c2d12 100%)',
  },
  {
    id: 's13', name: 'Crepe Saree — Charcoal Black', sku: '300013', barcode: '300013',
    price: 1799, category: 'georgette', fabric: 'Crepe with Satin Border', stock: 50,
    image: img('photo-1509631179647-0177331693ae'),
    swatch: 'linear-gradient(135deg,#09090b 0%,#52525b 55%,#09090b 100%)',
  },
  {
    id: 's14', name: 'Maheshwari Saree — Turquoise', sku: '300014', barcode: '300014',
    price: 2499, category: 'cotton', fabric: 'Maheshwari Cotton-Silk', stock: 28,
    image: img('photo-1496747611176-843222e1e57c'),
    swatch: 'linear-gradient(135deg,#083344 0%,#22d3ee 55%,#083344 100%)',
  },
  {
    id: 's15', name: 'Net Embroidered Saree — Bridal Red', sku: '300015', barcode: '300015',
    price: 5999, category: 'banarasi', fabric: 'Net with Heavy Embroidery', stock: 7,
    image: img('photo-1595777457583-95e059d581b8'),
    swatch: 'linear-gradient(135deg,#450a0a 0%,#ef4444 50%,#b45309 100%)',
  },
];
