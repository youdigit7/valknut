import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ProductCard } from '../ui/ProductCard';

export const NewArrivalsSection: React.FC = () => {
  const { products, setSelectedProduct, addToCart, showToast } = useStore();
  
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);
  const displayItems = newArrivals.length > 0 ? newArrivals : products.slice(0, 4);

  if (displayItems.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-[#0E1017] w-full flex flex-col justify-center items-center border-b border-white/10 overflow-hidden">
      <Container size="default">
        
        <SectionHeading
          align="center"
          eyebrow="FRESH OFF THE LOOM"
          title="NEW ARRIVALS"
          subtitle="The latest oversized silhouettes and tactical essentials released for Spring/Summer 2026."
          linkText="VIEW ALL NEW DROPS"
          linkHref="#/shop"
        />

        {/* Responsive Product Grid */}
        <div className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 w-full mx-auto">
          {displayItems.map((product) => (
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
