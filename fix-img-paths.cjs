const fs = require('fs');
const products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));

// Update image paths - use logo if localImage doesn't exist in public folder
const updated = products.map(p => ({
  ...p,
  localImage: p.logo && p.logo.startsWith('http') ? p.logo : `/assets/products/${p.id}.png`
}));

fs.writeFileSync('src/data/products.json', JSON.stringify(updated, null, 2));
console.log('✓ Updated all image paths');
console.log('Sample:', updated[0].name, '| Image:', updated[0].localImage);
