const fs = require('fs');
const products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));

// Add GitHub student and teacher verification
const githubProducts = [
  {
    "id": "github-student-4",
    "name": "Github Student Verification - $4",
    "description": "Student verification for Github Education. Reliable and fast.",
    "usageGuide": "",
    "usdPrice": 4,
    "binancePrice": 4,
    "binanceCustomerPays": 4,
    "stock": 100,
    "totalStock": 100,
    "sold": 0,
    "logo": "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    "emoji": "github",
    "enriched": {
      "description": "Student verification for Github Education. Reliable and fast.",
      "warranty": "10-day warranty.",
      "refund": "Replacement provided if verification fails.",
      "notes": ["Better on 10-day old accounts", "May have ban risk within 1 month"],
      "useCases": ["Github Education", "Verification"]
    },
    "warrantyType": "end_of_day",
    "warrantyDays": 10,
    "isSlotProduct": false,
    "slotDurations": [],
    "promotions": [],
    "localImage": "/assets/products/github-student.svg"
  },
  {
    "id": "github-teacher-7",
    "name": "Github Teacher Verification - $7",
    "description": "Teacher verification for Github Education.",
    "usageGuide": "",
    "usdPrice": 7,
    "binancePrice": 7,
    "binanceCustomerPays": 7,
    "stock": 100,
    "totalStock": 100,
    "sold": 0,
    "logo": "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    "emoji": "github",
    "enriched": {
      "description": "Teacher verification for Github Education.",
      "warranty": "10-day warranty.",
      "refund": "Replacement provided if verification fails.",
      "notes": ["Better on 10-day old accounts", "May have ban risk within 1 month"],
      "useCases": ["Github Education", "Verification"]
    },
    "warrantyType": "end_of_day",
    "warrantyDays": 10,
    "isSlotProduct": false,
    "slotDurations": [],
    "promotions": [],
    "localImage": "/assets/products/github-teacher.svg"
  }
];

// Check if GitHub products exist, if not add them
const hasGithub = products.some(p => p.name.toLowerCase().includes('github'));
if (!hasGithub) {
  products.push(...githubProducts);
  fs.writeFileSync('src/data/products.json', JSON.stringify(products, null, 2));
  console.log('✓ Added GitHub products');
} else {
  console.log('✓ GitHub products already exist');
}

console.log('Total products:', products.length);
