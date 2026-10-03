import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ProductCard } from '../ui/ProductCard';

export const BestSellersSection: React.FC = () => {
  const { products, setSelectedProduct, addToCart, showToast } = useStore();
  
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const displayProducts = bestSellers.length > 0 ? bestSellers : products.slice(0, 4);
  
  if (displayProducts.length === 0) return null;

  return (
    <section className="min-h-[85vh] lg:min-h-screen py-20 sm:py-24 lg:py-28 bg-[#0A0A0A] w-full flex flex-col justify-center items-center border-b border-white/10 overflow-hidden">
      <Container size="default">
        
        {/* Centered Section Header */}
        <SectionHeading
          align="center"
          eyebrow="PROVEN IN THE STREETS"
          title="BEST SELLERS"
          subtitle="Our most coveted heavy drape hoodies and boxy tees, restocked by popular demand."
          linkText="SEE ALL BEST SELLERS"
          linkHref="#/shop"
        />

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7 w-full mx-auto">
          {displayProducts.map((product) => (
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
