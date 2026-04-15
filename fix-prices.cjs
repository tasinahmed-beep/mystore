const fs = require('fs');
const products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));

// Update github-student-4 to have correct price
const studentIdx = products.findIndex(p => p.id === 'github-student-4');
if (studentIdx >= 0) {
  products[studentIdx].usdPrice = 4;
  products[studentIdx].binancePrice = 4;
  products[studentIdx].binanceCustomerPays = 4;
  console.log('✓ Updated github-student-4 price to $4');
}

// Update github-teacher-7 to have correct price
const teacherIdx = products.findIndex(p => p.id === 'github-teacher-7');
if (teacherIdx >= 0) {
  products[teacherIdx].usdPrice = 7;
  products[teacherIdx].binancePrice = 7;
  products[teacherIdx].binanceCustomerPays = 7;
  console.log('✓ Updated github-teacher-7 price to $7');
}

// Remove duplicate verified versions
const verifyIdx = products.findIndex(p => p.id === 'github-student-verify');
if (verifyIdx >= 0) {
  products.splice(verifyIdx, 1);
  console.log('✓ Removed github-student-verify (duplicate)');
}

const teacherVerifyIdx = products.findIndex(p => p.id === 'teacher-verify');
if (teacherVerifyIdx >= 0) {
  products.splice(teacherVerifyIdx, 1);
  console.log('✓ Removed teacher-verify (duplicate)');
}

fs.writeFileSync('src/data/products.json', JSON.stringify(products, null, 2));
console.log('✓ Saved products.json');
console.log('Total products:', products.length);
