import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ProductCard } from '../ui/ProductCard';

export const NewCollectionSection: React.FC = () => {
  const { products, setSelectedProduct, addToCart, showToast } = useStore();
  
  // Get featured / drop products (first 4 for high-impact editorial showcase)
  const collectionProducts = products.slice(0, 4);
  
  if (collectionProducts.length === 0) return null;

  return (
    <section id="featured-collection-section" className="py-14 sm:py-20 lg:py-24 bg-[#0A0A0A] w-full flex flex-col justify-center items-center border-b border-white/10 overflow-hidden">
      <Container size="default">
        
        {/* Centered Section Header */}
        <SectionHeading
          align="center"
          eyebrow="DROP 04 / EXCLUSIVE"
          title="FEATURED COLLECTION"
          subtitle="Twelve pieces built around weight, drape, and restraint. Each carries the sigil in sacred geometry."
          linkText="VIEW ALL NEW ARRIVALS"
          linkHref="#/shop"
        />

        {/* Responsive Product Grid */}
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 w-full mx-auto">
          {collectionProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              onQuickView={(p) => setSelectedProduct(p)}
              onAddToCart={(p) => {
                const firstVariant = p.variants[0] || { size: 'M', color: 'Onyx Black', colorHex: '#000000' };
                addToCart(p, firstVariant.size as any, firstVariant.color, firstVariant.colorHex, 1);
                showToast(`Added ${p.name} to your bag!`);
              }}
              onToggleWishlist={(p) => {
                showToast(`Added ${p.name} to your wishlist!`);
              }}
            />
          ))}
        </div>
      </Container>
    </section>
  );
};
