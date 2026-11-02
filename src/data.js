/* BUY store data + pricing helpers. Everything the screens show comes from here, so swapping the demo shop for a
   real one means editing STORE / CATEGORIES / PRODUCTS / OFFERS only.

   Product shape
     price, mrp      base price of one piece (the first value of every option)
     opts            variant groups shown under "Select Variant" (values may carry a price delta `d`)
     packs           bulk cards shown above the variants ({ n, label, f = price factor for the whole pack, best })
     custom          bulk "Custom" card: any quantity from min..max, per-unit price slides from price down to price * floor
*/
export const IMG = '/assets/shop/';
export const V2 = '/assets/v2/';
export const FG = '/assets/figma/';

export const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
export const off = (p, m) => Math.round((1 - p / m) * 100);
export const pad = n => String(n).padStart(2, '0');
export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const fmtTime = d => { let h = d.getHours(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${pad(h)}:${pad(d.getMinutes())} ${ap}`; };
export const fmtDay = d => `${d.getDate()} ${MON[d.getMonth()]}, ${DAYS[d.getDay()]}`;
export const fmtShort = d => `${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`;
export const fmtLong = d => `${MONTHS[d.getMonth()]} ${d.getDate()}`;

export const STORE = {
  name: 'Urban Threads BLR', slug: 'urban-threads-blr', category: 'Clothing Store',
  area: 'Koramangala, Bengaluru - 560034', logo: V2 + 'home/store-logo.png', phone: '+91 98765 43210',
  banners: [IMG + 'banner-1.jpg', IMG + 'banner-2.jpg', IMG + 'banner-3.jpg'],
  days: [['Sun', '10:30 AM', '09:30 PM'], ['Mon', null], ['Tue', null], ['Wed', '10:30 AM', '09:30 PM'], ['Thu', '11:00 AM', '08:00 PM'], ['Fri', '12:00 PM', '10:00 PM'], ['Sat', '11:00 AM', '09:00 PM']],
  about: 'At Urban Threads BLR, we handpick everyday wear, festive ethnic and sharp formals for the whole family. Fresh styles every week. Honest prices. Easy returns.',
  delivery: '2 - 5 days',
};

/* Figma 2167:7041 — icons are the Figma exports, tinted through a CSS mask so the selected tab can turn red */
export const CATEGORIES = [
  { id: 'all', label: ['All'], icon: V2 + 'home/cat-all.svg' },
  { id: 'men', label: ['Men’s', 'wears'], icon: V2 + 'home/cat-men.svg' },
  { id: 'women', label: ['Women’s', 'wears'], icon: V2 + 'home/cat-women.svg' },
  { id: 'kids', label: ['Kid’s', 'wears'], icon: V2 + 'home/cat-kids.svg' },
  { id: 'formal', label: ['Formal', 'Wears'], icon: V2 + 'home/cat-formal.svg' },
  { id: 'ethnic', label: ['Ethnic', 'wear'], icon: V2 + 'home/cat-ethnic.svg' },
];

const SIZES = (...v) => ({ name: 'Size', values: v.map(x => (typeof x === 'string' ? { v: x } : x)) });
const COLORS = (...v) => ({ name: 'Color', values: v.map(x => ({ v: x })) });
const PCS = [{ n: 1, label: '1 x Piece' }, { n: 3, label: '3 x Pieces', f: 0.85, best: true }];
const PIECE = { unit: 'pc', units: 'pcs', min: 2, max: 50, floor: 0.7 };
const ONE = [{ n: 1, label: '1 x Piece' }];

export const PRODUCTS = [
  { id: 'm1', cat: 'men', name: 'Heart Print Casual Shirt', img: [IMG + 'm-shirt-heart.jpg', IMG + 'm-shirts.jpg'], price: 899, mrp: 1299,
    opts: [SIZES('S', 'M', 'L', { v: 'XL', d: 50 }), COLORS('Blue', 'White', 'Black')], packs: PCS, custom: PIECE,
    desc: 'A relaxed-fit cotton shirt with a playful all-over heart print. Breathable, soft on the skin and easy to dress up or down — pair it with chinos for brunch or denims for a night out.' },
  { id: 'm2', cat: 'men', name: 'Checked Flannel Shirt', img: [IMG + 'm-check.jpg'], price: 1199, mrp: 1699,
    opts: [SIZES('M', 'L', 'XL', { v: 'XXL', d: 100 })], packs: PCS, custom: PIECE,
    desc: 'Brushed cotton flannel in a timeless black and grey check. Warm without the weight, with a structured collar and chest pocket.' },
  { id: 'm3', cat: 'men', name: 'Sports Polo T-Shirt', img: [IMG + 'm-polo.jpg'], price: 699, mrp: 999,
    opts: [SIZES('S', 'M', 'L', 'XL'), COLORS('Black', 'Orange')], packs: PCS, custom: PIECE,
    desc: 'Quick-dry pique polo with a contrast collar. Moisture-wicking fabric keeps you cool on the field and off it.' },
  { id: 'm4', cat: 'men', name: 'Linen Shirt Combo', img: [IMG + 'm-shirts.jpg', IMG + 'm-shirt-heart.jpg'], price: 1499, mrp: 2199, tag: 'Pack of 2',
    opts: [], packs: [{ n: 1, label: '1 Combo' }, { n: 2, label: '2 Combos' }, { n: 5, label: '5 Combos', f: 0.8, best: true }], custom: { unit: 'combo', units: 'combos', min: 2, max: 30, floor: 0.75 },
    desc: 'Two pure linen shirts in summer shades. Pre-washed for softness, cut for a modern regular fit.' },

  { id: 'w1', cat: 'women', name: 'Floral Midi Dress', img: [IMG + 'w-floral.jpg'], price: 1299, mrp: 1899,
    opts: [SIZES('XS', 'S', 'M', 'L'), COLORS('Black', 'Ivory')], packs: PCS, custom: PIECE,
    desc: 'A flowy long-sleeve midi in a delicate monochrome floral. Lined bodice, elastic cuffs and a flattering A-line skirt.' },
  { id: 'w2', cat: 'women', name: 'Wide-leg Jumpsuit', img: [IMG + 'w-jumpsuit.jpg'], price: 1599, mrp: 2299,
    opts: [SIZES('S', 'M', 'L')], packs: PCS, custom: PIECE,
    desc: 'One-and-done dressing: a crepe jumpsuit with a wrap neckline, tie waist and fluid wide legs.' },
  { id: 'w3', cat: 'women', name: 'Red Satin Evening Dress', img: [IMG + 'w-red.jpg'], price: 2499, mrp: 3499, left: 3,
    opts: [SIZES('XS', 'S', 'M', 'L', { v: 'XL', d: 150 })], packs: PCS, custom: PIECE,
    desc: 'Liquid satin that catches the light. A bias-cut silhouette with a draped neckline for evenings you want to remember.' },
  { id: 'w4', cat: 'women', name: 'Printed Kaftan Dress', img: [IMG + 'w-kaftan.jpg'], price: 999, mrp: 1499,
    opts: [], packs: [{ n: 1, label: '1 x Piece' }, { n: 2, label: '2 x Pieces' }, { n: 5, label: '5 x Pieces', f: 0.8, best: true }], custom: PIECE, tag: 'Free Size',
    desc: 'Free-size viscose kaftan with an all-over boho print. Breezy, roomy and made for holidays.' },

  { id: 'k1', cat: 'kids', name: 'Unicorn Party Dress', img: [IMG + 'k-unicorn.jpg'], price: 899, mrp: 1299,
    opts: [SIZES('2-3Y', '4-5Y', '6-7Y', '8-9Y')], packs: PCS, custom: PIECE,
    desc: 'Twirl-ready tulle dress with a sparkly unicorn bodice. Soft cotton lining so it never itches.' },
  { id: 'k2', cat: 'kids', name: 'Boys Casual Jacket Set', img: [IMG + 'k-boy.jpg'], price: 1199, mrp: 1599,
    opts: [SIZES('4-5Y', '6-7Y', '8-9Y', '10-11Y')], packs: PCS, custom: PIECE,
    desc: 'Layer-friendly jacket and tee combo in easy-care cotton. Built for playgrounds and puddles.' },
  { id: 'k3', cat: 'kids', name: 'Polka Dot Long-sleeve Top', img: [IMG + 'k-polka.jpg'], price: 549, mrp: 799,
    opts: [SIZES('2-3Y', '4-5Y', '6-7Y'), COLORS('Black', 'Navy')], packs: PCS, custom: PIECE,
    desc: 'A classic black and white polka top with a soft round neck. Pairs with everything in their wardrobe.' },
  { id: 'k4', cat: 'kids', name: 'Baby Onesie Pack', img: [IMG + 'k-onesies.jpg'], price: 799, mrp: 1199, tag: 'Pack of 3',
    opts: [], packs: [{ n: 1, label: '1 Pack' }, { n: 2, label: '2 Packs' }, { n: 5, label: '5 Packs', f: 0.8, best: true }], custom: { unit: 'pack', units: 'packs', min: 2, max: 30, floor: 0.7 },
    desc: 'Three organic cotton onesies with envelope necks and snap closures. Gentle on newborn skin.' },
  { id: 'k5', cat: 'kids', name: 'Kids Fleece Jacket', img: [IMG + 'k-fleece.jpg'], price: 1099, mrp: 1499,
    opts: [SIZES('4-5Y', '6-7Y', '8-9Y'), COLORS('Grey', 'Blue')], packs: PCS, custom: PIECE,
    desc: 'Cosy zip-up fleece that keeps the chill out on school mornings. Machine washable, pill-resistant.' },

  { id: 'f1', cat: 'formal', name: 'Classic Black Suit', img: [IMG + 'f-black.jpg'], price: 5999, mrp: 8999,
    opts: [SIZES('38', '40', '42', { v: '44', d: 300 })], packs: PCS, custom: PIECE,
    desc: 'A two-piece suit in a fine wool blend. Notch lapels, two-button closure and flat-front trousers.' },
  { id: 'f2', cat: 'formal', name: 'Navy Blue Suit', img: [IMG + 'f-blue.jpg', IMG + 'f-blue2.jpg'], price: 5499, mrp: 7999,
    opts: [SIZES('38', '40', '42', '44')], packs: PCS, custom: PIECE,
    desc: 'The everyday power suit. Slim-cut navy with a soft shoulder and half canvas construction.' },
  { id: 'f3', cat: 'formal', name: 'Pinstripe Blazer', img: [IMG + 'f-pin.jpg'], price: 3499, mrp: 4999,
    opts: [SIZES('38', '40', '42')], packs: PCS, custom: PIECE,
    desc: 'Cream and black pinstripes with a sharp peak lapel. Throw it over a tee or wear it with the matching trousers.' },
  { id: 'f4', cat: 'formal', name: 'White Formal Shirt', img: [IMG + 'f-white.jpg'], price: 999, mrp: 1499,
    opts: [SIZES('38', '39', '40', '42', '44')], packs: PCS, custom: PIECE,
    desc: 'Crisp, wrinkle-resistant cotton poplin with a cutaway collar. The shirt every wardrobe needs.' },

  { id: 'e1', cat: 'ethnic', name: 'White Floral Kurta Set', img: [IMG + 'e-kurta-w.jpg'], price: 1799, mrp: 2599,
    opts: [SIZES('S', 'M', 'L', 'XL')], packs: PCS, custom: PIECE,
    desc: 'Mul cotton kurta with delicate floral prints, paired with straight pants. Light, breathable and festive.' },
  { id: 'e2', cat: 'ethnic', name: 'Pink Floral Kurta Set', img: [IMG + 'e-kurta-pink.jpg'], price: 1699, mrp: 2399,
    opts: [SIZES('S', 'M', 'L', 'XL')], packs: PCS, custom: PIECE,
    desc: 'Blush pink kurta with hand-block florals and lace trims, with matching pants.' },
  { id: 'e3', cat: 'ethnic', name: 'Men’s Cotton Kurta', img: [IMG + 'e-kurta-m.jpg'], price: 1299, mrp: 1799,
    opts: [SIZES('M', 'L', 'XL', 'XXL'), COLORS('Blue', 'White')], packs: PCS, custom: PIECE,
    desc: 'A straight-cut cotton kurta with a mandarin collar. Festive enough for pujas, easy enough for every day.' },
  { id: 'e4', cat: 'ethnic', name: 'Green Silk Saree', img: [IMG + 'e-sari-green.jpg'], price: 3999, mrp: 5999, tag: 'Free Size',
    opts: [], packs: [{ n: 1, label: '1 Saree' }, { n: 2, label: '2 Sarees' }, { n: 5, label: '5 Sarees', f: 0.85, best: true }], custom: { unit: 'saree', units: 'sarees', min: 2, max: 20, floor: 0.8 },
    desc: 'Pure silk saree in emerald green with a zari border and unstitched blouse piece.' },
  { id: 'e5', cat: 'ethnic', name: 'Banarasi Red Saree', img: [IMG + 'e-sari-red.jpg'], price: 4999, mrp: 7499, tag: 'Free Size', left: 2,
    opts: [], packs: [{ n: 1, label: '1 Saree' }, { n: 2, label: '2 Sarees' }, { n: 5, label: '5 Sarees', f: 0.85, best: true }], custom: { unit: 'saree', units: 'sarees', min: 2, max: 20, floor: 0.8 },
    desc: 'Rich Banarasi weave in bridal red with gold motifs. Comes with a blouse piece.' },
  { id: 'e6', cat: 'ethnic', name: 'Tiered Anarkali Dress', img: [IMG + 'e-tiered.jpg'], price: 2199, mrp: 2999,
    opts: [SIZES('S', 'M', 'L'), COLORS('Yellow', 'Blue')], packs: PCS, custom: PIECE,
    desc: 'A sunny tiered anarkali with an embroidered yoke. Full flare, full of festive cheer.' },
  // simple items: no variants and no bulk options, so "+" adds them straight to the cart
  { id: 'a1', cat: 'acc', name: 'Classic Leather Wallet', img: [IMG + 'a-wallet.jpg'], price: 699, mrp: 999, tag: '1 Piece', opts: [], packs: ONE,
    desc: 'Slim bi-fold in full-grain leather with six card slots and a note pocket. Ages beautifully.' },
  { id: 'a2', cat: 'acc', name: 'Round Metal Sunglasses', img: [IMG + 'a-sunglasses.jpg'], price: 899, mrp: 1499, tag: 'UV 400', opts: [], packs: ONE,
    desc: 'Featherweight gold frame with dark green UV400 lenses. Comes with a hard case and cloth.' },
  { id: 'a3', cat: 'acc', name: 'White Trucker Cap', img: [IMG + 'a-cap.jpg'], price: 399, mrp: 599, tag: 'Free Size', opts: [], packs: ONE,
    desc: 'Breathable mesh back and an adjustable snap strap. One size fits most.' },
  { id: 'a4', cat: 'acc', name: 'Canvas Tote Bag', img: [IMG + 'a-tote.jpg'], price: 349, mrp: 499, tag: '1 Piece', opts: [], packs: ONE,
    desc: 'Heavy cotton canvas tote with long handles. Fits a laptop, groceries and then some.' },
  { id: 'a5', cat: 'acc', name: 'Steel Analog Watch', img: [IMG + 'a-watch.jpg'], price: 2499, mrp: 3999, tag: '1 Year Warranty', opts: [], packs: ONE,
    desc: 'Two-tone stainless steel watch with a date window and 50m water resistance.' },
  { id: 'a6', cat: 'acc', name: 'Eau de Parfum 50 ml', img: [IMG + 'a-perfume.jpg'], price: 1299, mrp: 1799, tag: '50 ml', opts: [], packs: ONE,
    desc: 'A fresh woody fragrance with notes of bergamot, cedar and musk. Lasts all day.' },
  { id: 'a7', cat: 'acc', name: 'Brown Leather Belt', img: [IMG + 'a-belt.jpg'], price: 599, mrp: 899, tag: 'Free Size', opts: [], packs: ONE,
    desc: 'Genuine leather belt with a brushed metal buckle. Trim-to-fit, so one size fits all.' },
  { id: 'a8', cat: 'acc', name: 'Striped Crew Socks', img: [IMG + 'a-socks.jpg'], price: 299, mrp: 449, tag: 'Pack of 3', opts: [], packs: ONE,
    desc: 'Soft combed-cotton socks in three playful stripes. Cushioned sole, reinforced heel.' },
  { id: 'a9', cat: 'acc', name: 'Satin Silk Scarf', img: [IMG + 'a-scarf.jpg'], price: 549, mrp: 799, tag: '1 Piece', opts: [], packs: ONE,
    desc: 'Lightweight satin scarf with a soft sheen. Wear it on the neck, in the hair or on a bag.' },
  { id: 'a10', cat: 'acc', name: 'Everyday Backpack', img: [IMG + 'a-backpack.jpg'], price: 1199, mrp: 1799, tag: '22 L', opts: [], packs: ONE,
    desc: 'Water-resistant 22 L backpack with a padded laptop sleeve and a quick-grab front pocket.' },

  // more of the range, so every category and sub-category has a proper shelf (mix of variant and simple items)
  { id: 'n1', cat: 'men', name: 'Essential White Crew Tee', img: [IMG + 'n-tee-white.jpg'], price: 449, mrp: 699,
    opts: [SIZES('S', 'M', 'L', 'XL'), COLORS('White', 'Black', 'Grey')], packs: PCS, custom: PIECE,
    desc: 'Heavyweight 220 GSM cotton tee with a ribbed crew neck. Holds its shape wash after wash.' },
  { id: 'n2', cat: 'men', name: 'Black Pique Polo', img: [IMG + 'n-polo-black.jpg'], price: 799, mrp: 1199,
    opts: [SIZES('S', 'M', 'L', 'XL')], packs: PCS, custom: PIECE,
    desc: 'Cotton pique polo with a two-button placket and a soft-touch collar. Smart enough for Fridays.' },
  { id: 'n3', cat: 'men', name: 'Breton Striped Tee', img: [IMG + 'n-tee-stripe.jpg'], price: 599, mrp: 899,
    opts: [SIZES('S', 'M', 'L')], packs: PCS, custom: PIECE,
    desc: 'Navy and white Breton stripes on breathable jersey. A wardrobe classic that never dates.' },
  { id: 'n4', cat: 'men', name: 'Oversized Graphic Tee', img: [IMG + 'n-tee-graphic.jpg'], price: 699, mrp: 999, tag: 'Free Size',
    opts: [], packs: PCS, custom: PIECE,
    desc: 'Drop-shoulder oversized tee with a screen-printed front graphic. Free size, relaxed fit.' },
  { id: 'n5', cat: 'formal', name: 'Charcoal Grey Blazer', img: [IMG + 'n-blazer-grey.jpg'], price: 3999, mrp: 5499,
    opts: [SIZES('38', '40', '42', '44')], packs: PCS, custom: PIECE,
    desc: 'Textured charcoal blazer with a slim notch lapel. Dress it up with trousers or down with denim.' },
  { id: 'n6', cat: 'ethnic', name: 'Mint Linen Kurta', img: [IMG + 'n-kurta-mint.jpg'], price: 1199, mrp: 1699,
    opts: [SIZES('M', 'L', 'XL')], packs: PCS, custom: PIECE,
    desc: 'Breezy linen-blend kurta in a soft mint shade with a band collar and side slits.' },
  { id: 'n7', cat: 'ethnic', name: 'Maroon Festive Kurta Set', img: [IMG + 'n-kurta-maroon.jpg'], price: 1899, mrp: 2799,
    opts: [SIZES('M', 'L', 'XL', 'XXL')], packs: PCS, custom: PIECE,
    desc: 'Rich maroon kurta with tonal embroidery and matching white churidar. Made for weddings and pujas.' },
  { id: 'n8', cat: 'women', name: 'Emerald Tiered Maxi Dress', img: [IMG + 'n-dress-maxi.jpg'], price: 1899, mrp: 2699,
    opts: [SIZES('XS', 'S', 'M', 'L')], packs: PCS, custom: PIECE,
    desc: 'Floor-sweeping tiered maxi in emerald georgette with a smocked waist and flutter sleeves.' },
  { id: 'n9', cat: 'women', name: 'Little Black Slip Dress', img: [IMG + 'n-dress-black.jpg'], price: 1499, mrp: 2199,
    opts: [SIZES('XS', 'S', 'M')], packs: PCS, custom: PIECE,
    desc: 'Satin-finish slip dress with adjustable straps and a cowl neck. Layer it or wear it solo.' },
  { id: 'n10', cat: 'ethnic', name: 'Pastel Pink Organza Saree', img: [IMG + 'n-saree-pink.jpg'], price: 2999, mrp: 4499, tag: 'Free Size',
    opts: [], packs: [{ n: 1, label: '1 Saree' }, { n: 2, label: '2 Sarees' }], custom: { unit: 'saree', units: 'sarees', min: 2, max: 20, floor: 0.8 },
    desc: 'Sheer organza saree in blush pink with a scalloped gold border and a running blouse piece.' },
  { id: 'n11', cat: 'ethnic', name: 'Royal Blue Silk Saree', img: [IMG + 'n-saree-blue.jpg'], price: 3499, mrp: 4999, tag: 'Free Size', opts: [], packs: ONE,
    desc: 'Art-silk saree in royal blue with a contrast pallu and woven motifs.' },
  { id: 'n12', cat: 'kids', name: 'Red Ruffle Party Frock', img: [IMG + 'n-k-frock.jpg'], price: 999, mrp: 1399,
    opts: [SIZES('2-3Y', '4-5Y', '6-7Y')], packs: PCS, custom: PIECE,
    desc: 'Layered ruffle frock in festive red with a soft cotton lining and a back zip.' },
  { id: 'n13', cat: 'kids', name: 'Yellow Pullover Hoodie', img: [IMG + 'n-k-hoodie.jpg'], price: 749, mrp: 1099,
    opts: [SIZES('4-5Y', '6-7Y', '8-9Y'), COLORS('Yellow', 'Navy')], packs: PCS, custom: PIECE,
    desc: 'Brushed-fleece hoodie with a kangaroo pocket. Bright, warm and easy to spot at the park.' },
  { id: 'n14', cat: 'kids', name: 'Organic Cotton Bodysuit', img: [IMG + 'n-k-bodysuit.jpg'], price: 349, mrp: 499, tag: '0-6 M', opts: [], packs: ONE,
    desc: 'Short-sleeve bodysuit in GOTS organic cotton with nickel-free snaps.' },
  { id: 'n15', cat: 'acc', name: 'Tan Leather Belt', img: [IMG + 'n-belt-tan.jpg'], price: 649, mrp: 999, tag: 'Free Size', opts: [], packs: ONE,
    desc: 'Vegetable-tanned leather belt with a matte silver buckle. Cut to fit at home.' },
  { id: 'n16', cat: 'acc', name: 'Active Smartwatch', img: [IMG + 'n-watch-smart.jpg'], price: 2999, mrp: 4999,
    opts: [COLORS('Black', 'Silver')], packs: ONE,
    desc: 'AMOLED smartwatch with heart-rate, SpO2, calling and a 7-day battery.' },
  { id: 'n17', cat: 'acc', name: 'Gold Chain Watch', img: [IMG + 'n-watch-gold.jpg'], price: 3499, mrp: 5499, tag: '1 Year Warranty', opts: [], packs: ONE,
    desc: 'Minimal gold-tone watch with a clean dial and a link bracelet.' },
  { id: 'n18', cat: 'acc', name: 'Classic Aviators', img: [IMG + 'n-sun-aviator.jpg'], price: 999, mrp: 1599, tag: 'UV 400', opts: [], packs: ONE,
    desc: 'Teardrop aviators with gradient brown lenses and a lightweight frame.' },
  { id: 'n19', cat: 'acc', name: 'Cat-eye Sunglasses', img: [IMG + 'n-sun-cat.jpg'], price: 849, mrp: 1299, tag: 'UV 400', opts: [], packs: ONE,
    desc: 'Retro cat-eye frame with smoky lenses. Comes with a soft pouch.' },
  { id: 'n20', cat: 'acc', name: 'Ribbed Knit Beanie', img: [IMG + 'n-beanie.jpg'], price: 449, mrp: 699, tag: 'Free Size',
    opts: [COLORS('Blue', 'Black', 'Red')], packs: ONE,
    desc: 'Soft acrylic-wool rib knit with a fold-over cuff. Warm without the itch.' },
  { id: 'n21', cat: 'acc', name: 'Black Leather Handbag', img: [IMG + 'n-handbag.jpg'], price: 2299, mrp: 3299, tag: '1 Piece', opts: [], packs: ONE,
    desc: 'Structured satchel with twin handles, a detachable strap and a zip-top main compartment.' },
  { id: 'n22', cat: 'acc', name: 'Mini Crossbody Sling', img: [IMG + 'n-sling.jpg'], price: 899, mrp: 1299,
    opts: [COLORS('Black', 'Tan')], packs: ONE,
    desc: 'Compact sling for phone, keys and cards, with an adjustable webbing strap.' },
  { id: 'n23', cat: 'acc', name: 'Laptop Backpack 25 L', img: [IMG + 'n-backpack-laptop.jpg'], price: 1799, mrp: 2599, tag: '25 L', opts: [], packs: ONE,
    desc: 'Padded laptop sleeve, luggage strap and a hidden anti-theft pocket.' },
  { id: 'n24', cat: 'acc', name: 'Weekender Duffel Bag', img: [IMG + 'n-duffel.jpg'], price: 2499, mrp: 3499, tag: '40 L', opts: [], packs: ONE,
    desc: 'Waxed canvas duffel with leather handles. Cabin-friendly for two-night trips.' },
  { id: 'n25', cat: 'acc', name: 'White Leather Sneakers', img: [IMG + 'n-sneakers.jpg'], price: 2499, mrp: 3499,
    opts: [SIZES('UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10')], packs: ONE,
    desc: 'Clean low-top sneakers in smooth leather with a cushioned rubber cupsole.' },
  { id: 'n26', cat: 'acc', name: 'Brown Oxford Brogues', img: [IMG + 'n-oxford.jpg'], price: 2999, mrp: 4299,
    opts: [SIZES('UK 7', 'UK 8', 'UK 9', 'UK 10')], packs: ONE,
    desc: 'Burnished leather brogues with a leather lining and a stitched sole.' },
  { id: 'n27', cat: 'acc', name: 'Tan Horsebit Loafers', img: [IMG + 'n-loafers.jpg'], price: 2699, mrp: 3799,
    opts: [SIZES('UK 7', 'UK 8', 'UK 9')], packs: ONE,
    desc: 'Slip-on loafers with a metal horsebit and a padded footbed.' },
  { id: 'n28', cat: 'acc', name: 'Black Leather Sandals', img: [IMG + 'n-sandals.jpg'], price: 1199, mrp: 1699,
    opts: [SIZES('UK 7', 'UK 8', 'UK 9', 'UK 10')], packs: ONE,
    desc: 'Two-strap leather sandals with a contoured footbed for all-day comfort.' },
  { id: 'n29', cat: 'acc', name: 'Nude Pointed Pumps', img: [IMG + 'n-heels.jpg'], price: 1799, mrp: 2499,
    opts: [SIZES('UK 3', 'UK 4', 'UK 5', 'UK 6')], packs: ONE,
    desc: 'Classic pointed-toe pumps with a 3-inch stiletto and a cushioned insole.' },
  { id: 'n30', cat: 'acc', name: 'Everyday Makeup Kit', img: [IMG + 'n-makeup.jpg'], price: 1499, mrp: 2199, tag: '6 Pieces', opts: [], packs: ONE,
    desc: 'Lipstick, blush, highlighter, brushes and a mini mirror in one travel pouch.' },
  { id: 'n31', cat: 'acc', name: 'Beard Oil 30 ml', img: [IMG + 'n-beard-oil.jpg'], price: 399, mrp: 599, tag: '30 ml', opts: [], packs: ONE,
    desc: 'Argan and jojoba beard oil that softens, tames and smells subtly of cedar.' },
  { id: 'n32', cat: 'acc', name: 'Gentle Face Cleanser', img: [IMG + 'n-facewash.jpg'], price: 349, mrp: 499, tag: '100 ml', opts: [], packs: ONE,
    desc: 'Soap-free gel cleanser with niacinamide. Cleans without leaving skin tight.' },
  { id: 'n33', cat: 'acc', name: 'Colour Pop Socks', img: [IMG + 'n-socks-colour.jpg'], price: 349, mrp: 499, tag: 'Pack of 3', opts: [], packs: ONE,
    desc: 'Textured cotton crew socks in grey, purple and mustard.' },
  { id: 'n34', cat: 'acc', name: 'Cotton Boxer Briefs', img: [IMG + 'n-boxers.jpg'], price: 599, mrp: 899,
    opts: [SIZES('S', 'M', 'L', 'XL')], packs: ONE,
    desc: 'Stretch-cotton boxer briefs with a soft waistband. Pack of 3.' },
];
export const P = id => PRODUCTS.find(p => p.id === id);

export const DELIVERY = 49;
export const OFFERS = [
  { id: 'free', min: 999, title: 'Unlock free delivery', short: 'Get Free delivery', unlocked: 'Free Delivery', done: 'Free delivery applied', kind: 'del' },
  { id: 'disc', min: 2999, title: 'Unlock 50% Discount', short: 'Get 50% Discount', unlocked: '50% Discount', done: '50% off applied (up to ₹300)', kind: 'pct' },
  { id: 'gift', min: 4999, title: 'Get Free Tote Bag', short: 'Get Free Tote Bag', unlocked: 'a free Tote Bag', done: 'Free canvas tote bag added', kind: 'gift' },
];
export const GIFT = { name: 'Canvas Tote Bag (free gift)', value: 299 };
export const PARTNER = { name: 'Suresh yadav', phone: '+91 98765 22211' };

/* ---------- variants & pricing ---------- */
export const defaultSel = p => Object.fromEntries(p.opts.map(o => [o.name, o.values[0].v]));
export const unitPrice = (p, sel = {}) => p.price + p.opts.reduce((a, o) => a + ((o.values.find(x => x.v === sel[o.name]) || {}).d || 0), 0);
export const mrpOf = (p, price) => Math.round(price * p.mrp / p.price);
/* custom bulk: per-unit price drops 2% per extra unit down to price * floor */
export const customUnit = (p, sel, n) => Math.round(unitPrice(p, sel) * Math.max(p.custom.floor, 1 - (n - 1) * 0.02));
export const packPrice = (p, sel, pack) => {
  const u = unitPrice(p, sel);
  if (pack.custom) return customUnit(p, sel, pack.n) * pack.n;
  // selections and cart lines only keep { n }: the pack's price factor comes from the product's own pack list
  const f = pack.f || (p.packs.find(x => x.n === pack.n) || {}).f || 1;
  return Math.round(u * pack.n * f);
};
export const packKey = pk => (pk.custom ? 'c' + pk.n : String(pk.n));
export const selLabel = (p, sel) => p.opts.map(o => sel[o.name]).filter(Boolean).join(' · ');
export const lineKey = (pid, sel, pack) => `${pid}|${Object.values(sel || {}).join('-')}|${packKey(pack)}`;
export const packText = (p, pack) => {
  if (!pack.custom) { const pk = p.packs.find(x => x.n === pack.n); return pk ? pk.label.replace(' x ', ' ') : `${pack.n} ${p.custom.units}`; }
  return `${pack.n} ${pack.n === 1 ? p.custom.unit : p.custom.units}`;
};

export const lineInfo = l => {
  const p = P(l.pid);
  const price = packPrice(p, l.sel, l.pack);
  const v = selLabel(p, l.sel);
  const pk = l.pack.n === 1 && !l.pack.custom ? '' : packText(p, l.pack);
  return { p, price, mrp: mrpOf(p, unitPrice(p, l.sel)) * l.pack.n, label: [v, pk].filter(Boolean).join(' · ') || p.tag || 'Standard', custom: !!l.pack.custom };
};
export const calcBill = lines => {
  const sub = lines.reduce((a, l) => a + lineInfo(l).price * l.qty, 0);
  const mrp = lines.reduce((a, l) => a + lineInfo(l).mrp * l.qty, 0);
  const delivery = !sub || sub >= OFFERS[0].min ? 0 : DELIVERY;
  const disc = sub >= OFFERS[1].min ? Math.min(300, Math.round(sub * .5)) : 0;
  const gst = Math.round((sub - disc) * .05);
  return { sub, mrp, delivery, disc, gst, gift: sub >= OFFERS[2].min, total: sub - disc + delivery + gst, count: lines.reduce((a, l) => a + l.qty, 0) };
};
export const nextOffer = sub => OFFERS.find(o => sub < o.min) || null;
export const qtyInCart = (cart, pid) => cart.filter(l => l.pid === pid).reduce((a, l) => a + l.qty, 0);
export const hasChoices = p => p.opts.length > 0;
/* swatch colours for the colour chips on product cards */
export const SWATCH = { Blue: '#3b6fd8', White: '#ffffff', Black: '#1f1f1f', Orange: '#f28c28', Ivory: '#f4ecd8', Navy: '#1f2f5c', Grey: '#9a9a9a', Yellow: '#f2c230', Red: '#c62828' };

export const sortedProducts = (S, cat = S.cat) => {
  let list = PRODUCTS.filter(p => (cat === 'all' || p.cat === cat) && (!S.search || p.name.toLowerCase().includes(S.search.toLowerCase())));
  const pr = p => p.price;
  if (S.sort === 'low') list = [...list].sort((a, b) => pr(a) - pr(b));
  if (S.sort === 'high') list = [...list].sort((a, b) => pr(b) - pr(a));
  if (S.sort === 'off') list = [...list].sort((a, b) => off(b.price, b.mrp) - off(a.price, a.mrp));
  return list;
};

/* search: every query word must be the start of a word in the product's name, category, tag or variant values
   (so "red saree", "kurta xl", "shi" work, and "men" does not match "women"). Apostrophes are dropped on both sides,
   so a typed ' matches the ’ in "Men’s". With no query the screen shows suggestions: biggest discounts first. */
export const searchTokens = s => s.toLowerCase().replace(/['’`]/g, '').split(/[^\p{L}\p{N}]+/u).filter(Boolean);
const haystack = p => searchTokens([p.name, (CATEGORIES.find(c => c.id === p.cat) || {}).label?.join(' '), p.cat, p.tag, ...p.opts.flatMap(o => o.values.map(v => v.v))].filter(Boolean).join(' '));
export const searchProducts = (q, sort) => {
  const words = searchTokens(q);
  let list = words.length ? PRODUCTS.filter(p => { const h = haystack(p); return words.every(w => h.some(t => t.startsWith(w))); }) : [...PRODUCTS].sort((a, b) => off(b.price, b.mrp) - off(a.price, a.mrp)).slice(0, 8);
  if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
  if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
  if (sort === 'off') list = [...list].sort((a, b) => off(b.price, b.mrp) - off(a.price, a.mrp));
  return list;
};
export const catLabel = p => (CATEGORIES.find(c => c.id === p.cat) || { label: [''] }).label.join(' ');

/* ---------- demo order history + refunds ---------- */
const ADDR = { street: '23, 4th Cross, 6th Main', road: 'Near BDA Complex', area: 'HSR Layout', pin: '560102', city: 'Bengaluru', state: 'Karnataka' };
const item = (pid, label, qty, price) => ({ pid, name: P(pid).name, label, qty, price, img: P(pid).img[0] });
export const seedOrders = () => {
  const d = new Date(); d.setDate(d.getDate() - 6);
  const d2 = new Date(); d2.setDate(d2.getDate() - 14);
  return [
    { id: 'ORD3981KL', otp: '2290', status: 'delivered', placedAt: d, times: { placed: d, delivered: d }, refund: false, past: true, txn: 'T2405161359421107', addr: ADDR,
      items: [item('w1', 'M · Black', 1, 1299), item('k3', '4-5Y · Black', 2, 549), item('m3', 'L · Black', 1, 699), item('e3', 'L · Blue', 1, 1299)],
      bill: { sub: 4395, mrp: 6295, disc: 300, delivery: 0, gst: 205, total: 4300, count: 5 } },
    { id: 'ORD3710QX', otp: '8812', status: 'cancelled', placedAt: d2, times: { placed: d2 }, refund: true, past: true, txn: 'T2405161359402288', addr: ADDR,
      items: [item('f4', '40', 1, 999)],
      bill: { sub: 999, mrp: 1499, disc: 0, delivery: 0, gst: 50, total: 1049, count: 1 } },
  ];
};

/* saved address book (the customer's own addresses; dist = km from the store, shown on the card) */
export const ADDR_TYPES = [['home', 'Home'], ['office', 'Office'], ['other', 'Other']];
export const seedAddresses = () => [
  { id: 'a1', type: 'office', label: 'Office', street: 'YNS Building, 3rd Floor', road: 'Tavarekere Main Road, Opp. Lanson Toyota', area: 'Tavarekere', pin: '560029', city: 'Bengaluru', state: 'Karnataka', dist: 1.2, phone: '9876543210', last: 'Last ordered 6 days ago' },
  { id: 'a2', type: 'home', label: 'Home', street: 'Flat 23, Mokshith Residency', road: '4th Cross, 6th Main', area: 'HSR Layout', pin: '560102', city: 'Bengaluru', state: 'Karnataka', dist: 3.2, phone: '9876543210' },
  { id: 'a3', type: 'other', label: 'Parents', street: '12, Lakshmi Nilaya', road: 'Near Ganesha Temple, 2nd Stage', area: 'BTM Layout', pin: '560076', city: 'Bengaluru', state: 'Karnataka', dist: 4.8, phone: '9845012345' },
  { id: 'a4', type: 'other', label: 'Gym', street: 'Cult Fit, 1st Floor', road: '80 Feet Road', area: 'Koramangala 4th Block', pin: '560034', city: 'Bengaluru', state: 'Karnataka', dist: 0.6, phone: '9876543210' },
  { id: 'a5', type: 'home', label: 'Hostel', street: 'Hall 2, Room 407', road: 'Christ University Campus', area: 'Hosur Road', pin: '560029', city: 'Bengaluru', state: 'Karnataka', dist: 2.4, phone: '9876543210' },
];
export const addrLine = a => [a.street, a.road, a.area, `${a.city} - ${a.pin}`].filter(Boolean).join(', ');
export const fmtDist = d => (d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`);

const at = (daysAgo, h, m) => { const x = new Date(); x.setDate(x.getDate() - daysAgo); x.setHours(h, m, 0, 0); return x; };
const RITEMS = [item('m1', 'M · Blue', 1, 899), item('w2', 'S', 2, 1599), item('k1', '4-5Y', 1, 899), item('f4', '40', 1, 999), item('e1', 'M', 1, 1799), item('m3', 'L · Black', 1, 699), item('k3', '2-3Y · Navy', 1, 549)];
export const seedRefunds = () => [
  { id: '2026-092', code: 'F67', order: 'ORD4121RL', reason: 'Out of Stock', amount: 3100, at: at(1, 10, 30), status: 'pending', items: RITEMS.slice(0, 3) },
  { id: '2026-088', code: 'B12', order: 'ORD4096TX', reason: 'Out of Stock', amount: 1599, at: at(2, 16, 5), status: 'pending', items: RITEMS.slice(1, 2) },
  { id: '2026-081', code: 'K04', order: 'ORD4071PA', reason: 'Out of Stock', amount: 899, at: at(3, 12, 45), status: 'pending', items: RITEMS.slice(2, 3) },
  { id: '2026-074', code: 'M33', order: 'ORD4040ZE', reason: 'Size unavailable', amount: 2398, at: at(4, 11, 10), status: 'pending', items: RITEMS.slice(3, 5) },
  { id: '2026-066', code: 'F67', order: 'ORD3994QN', reason: 'Order Cancelled', amount: 1799, at: at(5, 18, 20), status: 'pending', items: RITEMS.slice(4, 5) },
  { id: '2026-052', code: 'R19', order: 'ORD3710QX', reason: 'Order Cancelled', amount: 1049, at: at(8, 10, 30), status: 'overdue', days: 8, items: RITEMS.slice(3, 4) },
  { id: '2026-041', code: 'F67', order: 'ORD3655LM', reason: 'Out of Stock', amount: 935, at: at(12, 16, 12), status: 'refunded', utr: 'UTR45126232321', items: RITEMS.slice(5, 7) },
  { id: '2026-033', code: 'D21', order: 'ORD3602HB', reason: 'Order Cancelled', amount: 2499, at: at(16, 9, 40), status: 'refunded', utr: 'UTR45126231874', items: RITEMS.slice(0, 1) },
  { id: '2026-027', code: 'A08', order: 'ORD3561KC', reason: 'Out of Stock', amount: 1299, at: at(20, 13, 15), status: 'refunded', utr: 'UTR45126230952', items: RITEMS.slice(4, 6) },
  { id: '2026-019', code: 'F67', order: 'ORD3508WD', reason: 'Damaged item', amount: 549, at: at(27, 19, 0), status: 'refunded', utr: 'UTR45126230017', items: RITEMS.slice(6, 7) },
];
