# VALKNUT Official — Requirements Traceability Matrix (RTM)

## Document ID: QA-RTM-01

This matrix maps all core system requirements and functional areas (A through N) to their source implementation files, automated test cases, and empirical execution results.

### Status Legend
- **PASS**: Verified and executed with empirical evidence; zero defects observed.
- **FAIL**: Executed test failed or confirmed defect identified.
- **BLOCKED**: Cannot be verified due to external dependency (e.g. merchant gateway sandbox keys or pending 3rd party account verification).
- **NOT TESTED**: Out of current automated scope or deferred to manual client acceptance.

---

| Req ID | Requirement Area | Description | Implementation Source | Test ID / Test File | Status | Notes / Evidence |
|---|---|---|---|---|---|---|
| **REQ-A01** | Homepage Navigation | Homepage loads without fatal JS errors | `src/pages/HomePage.tsx`, `src/App.tsx` | `AUTO-UI-01`, Browser | **PASS** | Vite build clean, no uncaught exceptions on root load |
| **REQ-A02** | Brand Identity | Logo navigates to homepage; footer links operational | `src/components/layout/Navbar.tsx`, `Footer.tsx` | `AUTO-UI-02`, Browser | **PASS** | Routing tested via HashRouter navigation |
| **REQ-A03** | Social & WhatsApp | WhatsApp concierge & Instagram links point to valid targets | `src/components/layout/Footer.tsx`, `WhatsAppButton.tsx` | `AUTO-UI-03` | **PASS** | Concierge link properly configured with prefilled message |
| **REQ-B01** | Product Catalog | Catalog renders active products with price and tags | `src/pages/ProductCatalog.tsx`, `productService.ts` | `src/__tests__/product_catalog.test.ts` | **PASS** | Verified Supabase row to Product mapper |
| **REQ-B02** | Catalog Filtering | Category, subcategory, and price range filtering | `src/pages/ProductCatalog.tsx` | `src/__tests__/product_catalog.test.ts` | **PASS** | Verified category matching and empty state fallback |
| **REQ-B03** | Product Search | Real-time text search across product titles and tags | `src/pages/ProductCatalog.tsx` | `src/__tests__/product_catalog.test.ts` | **PASS** | Verified case-insensitive title and tag search |
| **REQ-C01** | Admin Product Create | Admin can create product with variants & images | `src/pages/AdminDashboard.tsx`, `productService.ts` | `AUTO-CRUD-01`, Live Supabase | **PASS** | Verified admin can insert product row to Supabase |
| **REQ-C02** | Admin Product Update | Admin can update product price, stock, and descriptions | `src/pages/AdminDashboard.tsx`, `productService.ts` | `AUTO-CRUD-02`, Live Supabase | **PASS** | Verified row updates in Supabase `products` |
| **REQ-C03** | Admin Auth Boundary | Unauthenticated or customer users blocked from admin mutations | `src/services/authService.ts`, `AdminDashboard.tsx` | `src/__tests__/auth_and_security.test.ts` | **PASS** | Verified non-admin redirected from `/admin` |
| **REQ-D01** | Cloudinary Direct Upload | Direct unsigned upload to Cloudinary CDN preset | `src/services/mediaService.ts` | `src/__tests__/media_cloudinary.test.ts` | **PASS** | Verified preset `valknut_preset` uploads returning 200 OK |
| **REQ-D02** | Media Type/Size Validation | Reject non-image files or assets exceeding 10MB | `src/services/mediaService.ts` | `src/__tests__/media_cloudinary.test.ts` | **PASS** | Executable/binary rejected; 10MB limit enforced |
| **REQ-D03** | Cloudinary URL Transform | Dynamic URL optimization with `f_auto`, `q_auto`, and widths | `src/services/mediaService.ts` | `src/__tests__/media_cloudinary.test.ts` | **PASS** | URL transformed with parameters without breaking URL |
| **REQ-D04** | Cloudinary Secret Safety | Cloudinary API secret never exposed in frontend bundle | `src/services/mediaService.ts`, `.env` | `src/__tests__/media_cloudinary.test.ts` | **PASS** | Verified `getCloudinaryConfig()` does not expose secrets |
| **REQ-E01** | Product Variant Selection | Users can select size and color variants | `src/pages/ProductDetailsPage.tsx`, `ProductCard.tsx` | `src/__tests__/product_catalog.test.ts` | **PASS** | Multi-variant selection verified |
| **REQ-E02** | Out-of-Stock Enforcement | Out-of-stock variants cannot be added or checked out | `src/services/orderService.ts` | `src/__tests__/order_security_pricing.test.ts` | **PASS** | Rejects variant when `stock <= 0` |
| **REQ-E03** | Inventory Deduction | Deduct variant stock upon confirmed order | `src/services/orderService.ts` | `src/__tests__/order_security_pricing.test.ts` | **PASS** | Fixed in BUG-02; updates `valknut_products_v2` & Supabase |
| **REQ-F01** | Shopping Bag Operations | Add item, change quantity, remove item | `src/context/CartContext.tsx` | `AUTO-CART-01`, Browser | **PASS** | Verified local storage cart persistence |
| **REQ-F02** | Free Shipping Threshold | Free shipping applied at >= 10,000 LKR, else 450 LKR | `src/services/shippingService.ts` | `src/__tests__/order_security_pricing.test.ts` | **PASS** | Verified standard delivery shipping tier rules |
| **REQ-G01** | Customer Auth Login | Supabase Auth login with email/password | `src/services/authService.ts`, `AccountPage.tsx` | `src/__tests__/auth_and_security.test.ts` | **PASS** | Authenticates user and issues JWT |
| **REQ-G02** | Customer Session Storage | Supabase Auth session token securely stored | `src/services/authService.ts` | `src/__tests__/auth_and_security.test.ts` | **PASS** | Verified `sb-urwhkkrozmlpadjmiqpc-auth-token` format |
| **REQ-G03** | Admin User Provisioning | Designated admin credentials active in Supabase | `src/services/authService.ts`, Supabase Auth | Live REST Probe | **PASS** | Admin `valknutofficial4@gmail.com` validated |
| **REQ-H01** | Checkout Pricing Validation | Server-side validation of product prices and coupons | `src/services/orderService.ts` | `src/__tests__/order_security_pricing.test.ts` | **PASS** | Client-tampered prices rejected against canonical prices |
| **REQ-H02** | Order Schema Conformance | Order creation complies with Supabase UUID and JSONB schema | `src/services/orderService.ts` | `src/__tests__/order_security_pricing.test.ts` | **PASS** | Fixed in BUG-01; generates UUIDs and JSONB |
| **REQ-H03** | Guest Order Creation RLS | Unauthenticated guest checkout inserts order to Supabase | `src/services/orderService.ts`, Supabase RLS | RLS Audit Probe | **FAIL** | Blocked by Supabase RLS unless public policy is applied (BUG-04) |
| **REQ-I01** | Koko PayLater Gateway | 3-installment payment integration | `src/services/paymentService.ts` | Gateway Probe | **BLOCKED** | Merchant production API keys required |
| **REQ-I02** | OnePay Card Gateway | Credit/Debit card payment gateway | `src/services/paymentService.ts` | Gateway Probe | **BLOCKED** | Merchant production API keys required |
| **REQ-I03** | Bank Deposit Payment | Manual slip upload and reference submission | `src/services/orderService.ts`, `CheckoutPage.tsx` | Checkout Flow | **PASS** | Generates pending order with bank instructions |
| **REQ-J01** | Admin Order Management | View customer orders, order items, and shipping info | `src/pages/AdminDashboard.tsx`, `orderService.ts` | Admin Order Probe | **PASS** | Fetches orders from Supabase `orders` table |
| **REQ-J02** | Order Status Progression | Update order from PENDING to PROCESSING / SHIPPED | `src/pages/AdminDashboard.tsx`, `orderService.ts` | Admin Order Probe | **PASS** | Status updates persist to Supabase |
| **REQ-K01** | Coupon Code Validation | Validate percentage and fixed discount coupons | `src/services/couponService.ts`, `orderService.ts` | `src/__tests__/order_security_pricing.test.ts` | **PASS** | Validates minimum order and expiration date |
| **REQ-K02** | SMS Dispatch | Order confirmation SMS notifications | `SMS_GATEWAY_OWNER_GUIDE.md` | Notify.lk Gateway | **BLOCKED** | Registration pending 2-day verification with provider |
| **REQ-L01** | Custom Studio Visualizer | Interactive 3D/2D garment preview with custom text | `src/components/customStudio/CustomStudio.tsx` | `src/__tests__/custom_studio.test.ts` | **PASS** | Canvas preview and typography rendering |
| **REQ-L02** | Custom Artwork Upload | Upload customer graphic to Cloudinary custom folder | `src/components/customStudio/CustomStudio.tsx` | `src/__tests__/custom_studio.test.ts` | **PASS** | Direct upload to `valknut/custom-studio/` |
| **REQ-L03** | Custom Studio Pricing | Surcharge calculation for printing/embroidery | `src/components/customStudio/CustomStudio.tsx` | `src/__tests__/custom_studio.test.ts` | **PASS** | Base price + customization surcharge calculated |
| **REQ-M01** | Responsive Viewports | Mobile (375px), Tablet (768px), Desktop (1440px) | `src/index.css`, components | Browser / DevTools | **PASS** | Verified dark luxury layout without horizontal overflow |
| **REQ-M02** | Accessibility & Focus | ARIA labels, semantic buttons, keyboard navigation | UI Components | Component Audit | **PASS** | Focus rings and readable contrasts verified |
| **REQ-N01** | Supabase RLS Policies | Row Level Security enabled on sensitive tables | Supabase Database | Database Audit Probe | **PASS** | Verified RLS enabled on `orders`, `products` |
| **REQ-N02** | Client Tamper Resistance | Client cannot forge subtotal or payment status | `src/services/orderService.ts` | `src/__tests__/order_security_pricing.test.ts` | **PASS** | Order prices re-verified against official catalog |
