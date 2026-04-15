const fs = require('fs');
const products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));

// Update products with local image paths based on their ID
const updated = products.map(p => ({
  ...p,
  localImage: `/assets/products/${p.id}.png`
}));

fs.writeFileSync('src/data/products.json', JSON.stringify(updated, null, 2));
console.log('✓ Updated all products with local image paths');
