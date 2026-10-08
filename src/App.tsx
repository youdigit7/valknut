import React, { useState, useEffect, Suspense, lazy } from 'react';
import './App.css';
import { StoreProvider, useStore } from './context/StoreContext';
import { AppThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SEOHead } from './components/common/SEOHead';
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getBreadcrumbSchema,
  getCustomStudioSEOMetadata,
  type SEOMetadata
} from './utils/seo';

import { HeroBanner } from './components/home/HeroBanner';
import { BrandIntro } from './components/home/BrandIntro';
import { NewCollectionSection } from './components/home/NewCollectionSection';
import { NewArrivalsSection } from './components/home/NewArrivalsSection';
import { BestSellersSection } from './components/home/BestSellersSection';
import { ShopByCategory } from './components/home/ShopByCategory';
import { EditorialBanner } from './components/home/EditorialBanner';
import { BrandPhilosophy } from './components/home/BrandPhilosophy';
import { ValknutStorySection } from './components/home/ValknutStorySection';
import { FeaturedProducts } from './components/home/FeaturedProducts';
import { InstagramSection } from './components/home/InstagramSection';
import { NewsletterSection } from './components/home/NewsletterSection';
import { TrustBar } from './components/home/TrustBar';

const CustomStudio = lazy(() => import('./components/customStudio/CustomStudio').then(m => ({ default: m.CustomStudio })));
const ProductCatalog = lazy(() => import('./components/shop/ProductCatalog').then(m => ({ default: m.ProductCatalog })));
const ProductDetailsPage = lazy(() => import('./components/shop/ProductDetailsPage').then(m => ({ default: m.ProductDetailsPage })));
const CartPage = lazy(() => import('./components/cart/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./components/checkout/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const AccountPage = lazy(() => import('./components/account/AccountPage').then(m => ({ default: m.AccountPage })));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));

const StreetwearSriLankaSEO = lazy(() => import('./components/pages/StreetwearSriLankaSEO').then(m => ({ default: m.StreetwearSriLankaSEO })));
const BrandStoryPage = lazy(() => import('./components/pages/BrandStoryPage').then(m => ({ default: m.BrandStoryPage })));
const LookbookPage = lazy(() => import('./components/pages/LookbookPage').then(m => ({ default: m.LookbookPage })));
const SizeGuidePage = lazy(() => import('./components/pages/SizeGuidePage').then(m => ({ default: m.SizeGuidePage })));
const OrderTrackingPage = lazy(() => import('./components/pages/OrderTrackingPage').then(m => ({ default: m.OrderTrackingPage })));
const ShippingPolicyPage = lazy(() => import('./components/pages/ShippingPolicyPage').then(m => ({ default: m.ShippingPolicyPage })));

import { ProductDetailModal } from './components/shop/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { CustomerAccountModal } from './components/account/CustomerAccountModal';
import { NotificationToast } from './components/common/NotificationToast';

const PageLoadingFallback: React.FC = () => (
  <div className="w-full min-h-[60vh] flex flex-col items-center justify-center py-24 bg-[var(--bg-main)]">
    <div className="relative w-16 h-16 flex items-center justify-center mb-6">
      <div className="absolute inset-0 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
      <span className="font-heading font-black text-[#D4AF37] text-xl">V</span>
    </div>
    <p className="text-[11px] font-mono tracking-[0.3em] text-slate-400 uppercase animate-pulse">
      INITIALIZING SOVEREIGN INTERFACE...
    </p>
  </div>
);

const MainApp: React.FC = () => {
  const { selectedProduct, setSelectedProduct, setActiveCategory } = useStore();
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.hash || '#/';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      setCurrentRoute(hash);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (hash.startsWith('#/category/men') || hash.startsWith('#/shop/men')) {
        setActiveCategory('MEN');
      } else if (hash.startsWith('#/category/women') || hash.startsWith('#/shop/women')) {
        setActiveCategory('WOMEN');
      } else if (hash.startsWith('#/category/essentials') || hash.startsWith('#/shop/essentials')) {
        setActiveCategory('ESSENTIALS');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setActiveCategory]);

  const homeSEOMeta: SEOMetadata = {
    title: 'VALKNUT Official | Premium Streetwear & Oversized Apparel Sri Lanka',
    description: 'OWN YOUR MIND. CONTROL YOUR WORLD. Sri Lanka’s premier dark luxury streetwear brand. 480GSM heavyweight hoodies, oversized tees, bespoke Custom Studio, Koko BNPL & OnePay.',
    keywords: 'streetwear sri lanka, oversized t shirts sri lanka, valknut official, clothing brand colombo, heavyweight hoodies lk, custom print tshirts sri lanka, buy oversized tee colombo, pump cover gym sri lanka, dark fashion sri lanka',
    canonicalUrl: 'https://valknutofficial.com/',
    ogTitle: 'VALKNUT Official | Dark Luxury Heavyweight Streetwear',
    ogDescription: 'OWN YOUR MIND. CONTROL YOUR WORLD. 480GSM heavyweight garments engineered in Colombo.',
    ogImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=85',
    ogType: 'website',
    jsonLd: [
      getOrganizationSchema(),
      getWebSiteSchema(),
      getBreadcrumbSchema([{ name: 'Home', url: '/' }])
    ]
  };

  const renderCurrentView = () => {
    if (currentRoute.startsWith('#/sri-lanka-streetwear')) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <StreetwearSriLankaSEO />
        </Suspense>
      );
    }
    if (currentRoute.startsWith('#/brand-story')) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <BrandStoryPage />
        </Suspense>
      );
    }
    if (currentRoute.startsWith('#/lookbook')) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <LookbookPage />
        </Suspense>
      );
    }
    if (currentRoute.startsWith('#/size-guide')) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <SizeGuidePage />
        </Suspense>
      );
    }
    if (currentRoute.startsWith('#/track-order')) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <OrderTrackingPage />
        </Suspense>
      );
    }
    if (currentRoute.startsWith('#/shipping-returns')) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <ShippingPolicyPage />
        </Suspense>
      );
    }
    if (currentRoute.startsWith('#/custom-studio')) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <SEOHead metadata={getCustomStudioSEOMetadata()} />
          <div className="py-8 w-full flex justify-center">
            <CustomStudio />
          </div>
        </Suspense>
      );
    }
    if (currentRoute.startsWith('#/cart')) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <CartPage />
        </Suspense>
      );
    }
    if (currentRoute.startsWith('#/checkout')) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <CheckoutPage />
        </Suspense>
      );
    }
    if (currentRoute.startsWith('#/account/orders')) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <AccountPage initialSubTab="orders" />
        </Suspense>
      );
    }
    if (currentRoute.startsWith('#/account/profile')) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <AccountPage initialSubTab="profile" />
        </Suspense>
      );
    }
    if (currentRoute.startsWith('#/account')) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <AccountPage initialSubTab="dashboard" />
        </Suspense>
      );
    }
    if (currentRoute.startsWith('#/login')) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <AccountPage initialSubTab="login" />
        </Suspense>
      );
    }
    if (currentRoute.startsWith('#/register')) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <AccountPage initialSubTab="register" />
        </Suspense>
      );
    }
    if (currentRoute.startsWith('#/forgot-password')) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <AccountPage initialSubTab="forgot-password" />
        </Suspense>
      );
    }
    if (currentRoute.startsWith('#/admin')) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <AdminDashboard />
        </Suspense>
      );
    }
    if (currentRoute.startsWith('#/product/')) {
      const slug = currentRoute.replace('#/product/', '').split('?')[0];
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <ProductDetailsPage slug={slug} />
        </Suspense>
      );
    }
    if (currentRoute.startsWith('#/shop') || currentRoute.startsWith('#/category/')) {
      return (
        <Suspense fallback={<PageLoadingFallback />}>
          <div className="w-full">
            <ProductCatalog />
          </div>
        </Suspense>
      );
    }

    return (
      <div className="w-full max-w-[100vw] overflow-x-hidden flex flex-col items-center justify-start">
        <SEOHead metadata={homeSEOMeta} />
        <HeroBanner />
        <BrandIntro />
        <NewCollectionSection />
        <NewArrivalsSection />
        <BestSellersSection />
        <ShopByCategory />
        <EditorialBanner />
        <BrandPhilosophy />
        <ValknutStorySection />
        <FeaturedProducts />
        <InstagramSection />
        <NewsletterSection />
        <TrustBar />
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-clip flex flex-col selection:bg-[#d4af37] selection:text-black antialiased" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      <Navbar />
      <main className="flex-1 w-full max-w-[100vw] overflow-x-clip flex flex-col items-center">
        {renderCurrentView()}
      </main>
      <Footer />
      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <CartDrawer />
      <CheckoutModal />
      <CustomerAccountModal />
      <NotificationToast />
    </div>
  );
};

export function App() {
  return (
    <AppThemeProvider>
      <StoreProvider>
        <MainApp />
      </StoreProvider>
    </AppThemeProvider>
  );
}

export default App;