import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ProductCard } from '../ui/ProductCard';

export const FeaturedProducts: React.FC = () => {
  const { products, setSelectedProduct, addToCart, showToast } = useStore();
  
  const featured = products.slice(0, 4);
  
  if (featured.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-[#0E1017] w-full flex flex-col justify-center items-center border-b border-white/10 overflow-hidden">
      <Container size="default">
        
        {/* Centered Section Header */}
        <SectionHeading
          align="center"
          eyebrow="HANDPICKED SILHOUETTES"
          title="FEATURED PRODUCTS"
          subtitle="Essential heavy-cut streetwear pieces selected by our design directors."
          linkText="VIEW COMPLETE CATALOG"
          linkHref="#/shop"
        />

        {/* Responsive Product Grid */}
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 w-full mx-auto">
          {featured.map((product) => (
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
