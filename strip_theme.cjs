const fs = require('fs');
const path = require('path');

const files = [
  'components/shop/ProductDetailsPage.tsx',
  'components/pages/ShippingPolicyPage.tsx',
  'components/pages/SizeGuidePage.tsx',
  'components/pages/StreetwearSriLankaSEO.tsx',
  'components/pages/LookbookPage.tsx',
  'components/pages/OrderTrackingPage.tsx',
  'components/pages/BrandStoryPage.tsx',
  'components/home/EditorialBanner.tsx',
  'components/home/HeroBanner.tsx',
  'components/home/InstagramSection.tsx',
  'components/home/LimitedDropsSection.tsx',
  'components/home/NewArrivalsSection.tsx',
  'components/home/NewCollectionSection.tsx',
  'components/home/NewsletterSection.tsx',
  'components/home/ShopByCategory.tsx',
  'components/home/TrustBar.tsx',
  'components/home/ValknutStorySection.tsx',
  'components/home/ReviewsSection.tsx',
  'components/home/LifestyleFilmSection.tsx',
  'components/home/FeaturedProducts.tsx',
  'components/home/BrandPhilosophy.tsx',
  'components/customStudio/CustomStudio.tsx',
  'components/home/BrandIntro.tsx',
  'components/home/BestSellersSection.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, 'src', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Strip the const theme = ({ ... }); block regardless of whitespace
  content = content.replace(/const theme = \(\{[\s\S]*?\}\);\s*/g, '');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Stripped theme from ${file}`);
});
