/* Shop types BUY caters to (official sheet "BUY · shop categories") and the demo store shown for each.
   The prototype opens on a shop-type picker; applyShop() then rewrites STORE, CATEGORIES and every product's `cat`
   in place, so all screens keep importing the same objects. Category tabs show real product photos (Zepto / Blinkit
   style), cut from the supplied category image sheets into public/assets/cats/<shop>-<category>.webp. Categories
   with no matching photo yet keep their Hugeicons line icon (catIcons.js) inside the same peach circle.
   The catalogue itself stays the clothing demo: for non-fashion shops the products are only spread across the
   shop's categories so every tab has something to show. */
import { STORE, CATEGORIES, PRODUCTS, V2 } from './data.js';
import { iconUrl } from './catIcons.js';

const H = V2 + 'home/';
const c = (id, label, icon) => ({ id, label, icon });

export const SHOPS = [
  { id: 'fashion', name: 'Fashion', icon: 'shirt-01', store: 'Urban Threads BLR', kind: 'Clothing Store',
    about: 'we handpick everyday wear, festive ethnic and sharp formals for the whole family. Fresh styles every week',
    cats: [c('mens', 'Men’s Wear', H + 'cat-men.svg'), c('womens', 'Women’s Wear', H + 'cat-women.svg'), c('kids', 'Kids Wear', H + 'cat-kids.svg'),
      c('ethnic', 'Ethnic Wear', H + 'cat-ethnic.svg'), c('sports', 'Sports Wear', 'jogger-pants'), c('acc', 'Accessories', 'belt'),
      c('foot', 'Footwear', 'sandals'), c('bags', 'Bags & Luggage', 'luggage-01'), c('beauty', 'Beauty & Grooming', 'blush-brush-01'),
      c('inner', 'Innerwear', 'underpants-01'), c('watch', 'Watches & Jewellery', 'necklace'), c('eye', 'Sunglasses & Eyewear', 'glasses'),
      c('hats', 'Scarves, Hats & Gloves', 'hat')] },
  { id: 'food', name: 'Food & Drinks', icon: 'watermelon', store: 'FreshCart Bengaluru', kind: 'Grocery & Food Store',
    about: 'we stock farm-fresh produce, pantry staples and ready-to-eat favourites, delivered while they are still fresh',
    cats: [c('fresh', 'Fresh Products', 'watermelon'), c('frozen', 'Frozen Foods', 'fridge'), c('snacks', 'Snacks & Sweets', 'popcorn'),
      c('dairy', 'Dairy & Eggs', 'milk-oat'), c('bakery', 'Bakery Items', 'croissant'), c('cooking', 'Cooking Essentials', 'spatula'),
      c('pet', 'Pet Food', 'horse-head'), c('ready', 'Ready to Eat', 'hotdog'), c('dine', 'Dine-in Menu', 'menu-restaurant'),
      c('babyfood', 'Baby Food', 'baby-bottle'), c('nonalc', 'Non-Alcoholic Drinks', 'tea-pod'), c('alc', 'Alcoholic Drinks', 'ice-cubes'),
      c('organic', 'Organic Food', 'leaf-02'), c('meat', 'Meat & Seafood', 'paella'), c('healthfood', 'Health Foods', 'plant-02'),
      c('bev', 'Hot & Cold Drinks', 'cafe'), c('icecream', 'Ice Cream & Desserts', 'ice-cream-01')] },
  { id: 'home', name: 'Home Essentials', icon: 'lamp', store: 'Homely Essentials', kind: 'Home Essentials Store',
    about: 'we bring together everything that makes a house feel like home, from cleaning supplies to cosy decor',
    cats: [c('clean', 'Cleaning & Household', 'clean'), c('care', 'Personal Care', 'shampoo'), c('kitchen', 'Kitchenware', 'kitchen-utensils'),
      c('decor', 'Home Decor', 'flower'), c('furniture', 'Furniture', 'table'), c('bedding', 'Bedding & Curtains', 'hotel-01'),
      c('storage', 'Organizers & Storage', 'archive'), c('candles', 'Candles & Scents', 'fire'), c('plants', 'Plants & Pots', 'plant-01'),
      c('lights', 'Lights & Lamps', 'lamp'), c('laundry', 'Laundry', 'detergent')] },
  { id: 'health', name: 'Health & Wellness', icon: 'stethoscope-02', store: 'WellCare Pharmacy', kind: 'Pharmacy & Wellness Store',
    about: 'our pharmacists keep genuine medicines, wellness essentials and health devices ready for your family',
    cats: [c('meds', 'Medicines', 'vaccine'), c('kit', 'Medical Kit', 'hospital-01'), c('devices', 'Medical Devices', 'pulse-rectangle-01'),
      c('kitdev', 'Kits & Devices', 'stethoscope-02'), c('drinks', 'Health Drinks', 'milk-coconut'), c('fitness', 'Fitness Products', 'dumbbell-01'),
      c('ayur', 'Ayurvedic & Herbal', 'leaf-03'), c('yoga', 'Yoga & Exercise', 'yoga-mat'), c('vitamins', 'Vitamins & Supplements', 'dna'),
      c('pcare', 'Personal Care Devices', 'hair-dryer')] },
  { id: 'stationery', name: 'Stationery', icon: 'pen-01', store: 'Inkwell Stationers', kind: 'Stationery Store',
    about: 'we carry everything for school, office and art class, from notebooks and pens to printer supplies',
    cats: [c('writing', 'Writing Supplies', 'pen-01'), c('paper', 'Paper Products', 'note-01'), c('art', 'Art & Craft', 'paint-board'),
      c('books', 'Books', 'book-02'), c('school', 'School & Office', 'backpack-01'), c('printing', 'Printing Supplies', 'printer'),
      c('other', 'Other Products', 'stationery')] },
  { id: 'electronics', name: 'Electronics & Appliances', icon: 'smart-phone-01', store: 'Volt Electronics', kind: 'Electronics Store',
    about: 'we sell genuine phones, laptops and home appliances with brand warranty and honest advice',
    cats: [c('mobile', 'Mobiles & Accessories', 'smart-phone-01'), c('laptops', 'Computers & Laptops', 'laptop'), c('appliances', 'Home Appliances', 'fridge'),
      c('audio', 'Audio & Video', 'headphones'), c('smarthome', 'Smart Home Devices', 'google-home'), c('gaming', 'Gaming & Consoles', 'gameboy'),
      c('kitchenapp', 'Kitchen Appliances', 'dish-washer')] },
  { id: 'baby', name: 'Baby & Kids', icon: 'baby-bottle', store: 'Little Steps Baby Store', kind: 'Baby & Kids Store',
    about: 'we choose gentle, safe and fun essentials for little ones, so new parents have one less thing to worry about',
    cats: [c('babyfood', 'Baby Food', 'baby-bottle'), c('diapers', 'Diapers & Wipes', 'diaper'), c('skin', 'Baby Skincare', 'body-soap'),
      c('toys', 'Toys', 'rocking-horse'), c('clothes', 'Baby Clothing', 'baby-girl-dress'), c('safety', 'Baby Safety', 'safety-pin-01'),
      c('furniture', 'Baby Furniture', 'seesaw'), c('books', 'Kids Books', 'book-open-01'), c('gear', 'Baby Gear & Travel', 'infant')] },
  { id: 'auto', name: 'Automobile Needs', icon: 'car-03', store: 'AutoHub Spares', kind: 'Auto Spares Store',
    about: 'we keep genuine spare parts, accessories and care products for cars and bikes, fitted the right way',
    cats: [c('auto', 'Automobile', 'car-03'), c('spares', 'Spare Parts & Accessories', 'tire'), c('maint', 'Maintenance Kit', 'tools'),
      c('care', 'Car Care Products', 'car-05'), c('bike', 'Bike Accessories', 'bicycle-01')] },
  { id: 'tobacco', name: 'Tobacco & Smoking', icon: 'fire-02', store: 'Puff & Co.', kind: 'Tobacco & Smoke Shop',
    about: 'we stock a wide range of smoking accessories for adult customers only, sold responsibly',
    cats: [c('cig', 'Cigarettes', 'fire-02'), c('vape', 'Vapes', 'cloud-fast-wind'), c('hookah', 'Hookah', 'tea-pod'),
      c('tobacco', 'Tobacco', 'leaf-04'), c('lighters', 'Lighters & Ashtrays', 'fire-03'), c('others', 'Others', 'package-01')] },
  { id: 'gift', name: 'Gift Store', icon: 'gift', store: 'Wrapped With Love', kind: 'Gift Store',
    about: 'we put together thoughtful hampers, personalised gifts and fresh flowers for every occasion',
    cats: [c('hampers', 'Gift Hampers', 'gift'), c('personal', 'Personalised Gifts', 'gift-card'), c('novelty', 'Novelty Gifts', 'balloons'),
      c('handmade', 'Handmade Gifts', 'scissor'), c('cards', 'Greeting Cards', 'gift-card-02'), c('festival', 'Festival Gifts', 'fireworks'),
      c('souvenir', 'Souvenirs & Collectibles', 'star-award-01'), c('flowers', 'Flowers & Plants', 'tulip'), c('choco', 'Chocolates & Sweets', 'cheese-cake-01'),
      c('decor', 'Home Decor Gifts', 'wall-lamp'), c('wrap', 'Gift Wrapping', 'garlands'), c('frames', 'Photo Frames & Albums', 'image-02'),
      c('others', 'Others', 'package-01')] },
];
/* categories that have a photo in public/assets/cats */
const PHOTO = {
  fashion: 'mens womens kids ethnic sports acc foot bags beauty inner watch eye hats',
  food: 'fresh frozen snacks dairy bakery cooking ready dine babyfood nonalc organic meat healthfood bev icecream',
  home: 'clean care kitchen decor furniture bedding storage candles plants lights laundry',
  health: 'kit drinks fitness pcare',
  stationery: 'writing paper art books school printing other',
  electronics: 'appliances audio kitchenapp',
  baby: 'babyfood diapers skin toys clothes safety furniture books gear',
  auto: 'auto spares maint care bike',
  gift: 'novelty handmade cards festival flowers choco decor wrap frames',
};
export const catPhoto = (shop, cat) => ((PHOTO[shop] || '').split(' ').includes(cat) ? `/assets/cats/${shop}-${cat}.webp` : null);

export const shopOf = id => SHOPS.find(s => s.id === id) || SHOPS[0];

/* tab labels sit on two short lines: break at the space closest to the middle */
const twoLines = s => {
  const w = s.split(' ');
  if (w.length === 1) return [s];
  let best = 1, bd = Infinity;
  for (let i = 1; i < w.length; i++) { const d = Math.abs(w.slice(0, i).join(' ').length - w.slice(i).join(' ').length); if (d < bd) { bd = d; best = i; } }
  return [w.slice(0, best).join(' '), w.slice(best).join(' ')];
};

/* the clothing demo's own groups, for the fashion shop */
const FASHION = { men: 'mens', formal: 'mens', women: 'womens', kids: 'kids', ethnic: 'ethnic' };
const FASHION_PID = { m3: 'sports' };

PRODUCTS.forEach(p => { p.base = p.cat; });

export function applyShop(id) {
  const s = shopOf(id);
  const slug = s.store.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  Object.assign(STORE, { name: s.store, slug, category: s.kind, about: `At ${s.store}, ${s.about}. Honest prices. Easy returns.` });
  CATEGORIES.splice(0, CATEGORIES.length, { id: 'all', label: ['All'], icon: H + 'cat-all.svg', img: s.id === 'tobacco' ? null : `/assets/cats/${s.id}-all.webp` },
    ...s.cats.map(x => ({ id: x.id, label: twoLines(x.label), name: x.label, icon: iconUrl(x.icon), img: catPhoto(s.id, x.id) })));
  PRODUCTS.forEach((p, i) => {
    p.cat = s.id === 'fashion' ? FASHION_PID[p.id] || FASHION[p.base] : s.cats[i % s.cats.length].id;
  });
  if (typeof document !== 'undefined') document.title = `${s.store} · BUY`;
  return s;
}
