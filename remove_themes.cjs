const fs = require('fs');
const path = require('path');

const files = [
  'components/customStudio/CustomStudio.tsx',
  'components/home/BestSellersSection.tsx',
  'components/home/BrandIntro.tsx',
  'components/home/BrandPhilosophy.tsx',
  'components/home/EditorialBanner.tsx',
  'components/home/FeaturedProducts.tsx',
  'components/home/HeroBanner.tsx',
  'components/home/InstagramSection.tsx',
  'components/home/LifestyleFilmSection.tsx',
  'components/home/LimitedDropsSection.tsx',
  'components/home/NewArrivalsSection.tsx',
  'components/home/NewCollectionSection.tsx',
  'components/home/NewsletterSection.tsx',
  'components/home/ReviewsSection.tsx',
  'components/home/ShopByCategory.tsx',
  'components/home/TrustBar.tsx',
  'components/home/ValknutStorySection.tsx',
  'components/layout/Footer.tsx',
  'components/layout/Navbar.tsx',
  'components/pages/BrandStoryPage.tsx',
  'components/pages/LookbookPage.tsx',
  'components/pages/OrderTrackingPage.tsx',
  'components/pages/ShippingPolicyPage.tsx',
  'components/pages/SizeGuidePage.tsx',
  'components/pages/StreetwearSriLankaSEO.tsx',
  'components/shop/ProductDetailsPage.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, 'src', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove the `const theme = createTheme({ ... });` block
  content = content.replace(/const theme = createTheme\([\s\S]*?\}\);\n/g, '');

  // Remove imports for ThemeProvider and createTheme safely
  content = content.replace(/createTheme,?\s*/g, '');
  content = content.replace(/ThemeProvider,?\s*/g, '');
  
  // Clean up empty imports
  content = content.replace(/import\s*\{\s*\}\s*from\s*['"]@mui\/material['"];\n?/g, '');
  
  // Replace <ThemeProvider theme={theme}> and </ThemeProvider>
  content = content.replace(/<ThemeProvider[^>]*>/g, '<>');
  content = content.replace(/<\/ThemeProvider>/g, '</>');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
