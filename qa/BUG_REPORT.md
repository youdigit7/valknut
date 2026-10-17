# VALKNUT Official — Defect & Bug Report (QA-BR-01)

## Defect Summary Dashboard

| Bug ID | Title | Severity | Priority | Component / Service | Status |
|---|---|---|---|---|---|
| **BUG-01** | Order creation fails due to non-UUID IDs, schema mismatch & obsolete table calls | **CRITICAL** | P1 | `src/services/orderService.ts` | **FIXED** |
| **BUG-02** | Inventory deduction updates obsolete storage key and neglects cloud variant stock | **HIGH** | P1 | `src/services/orderService.ts` | **FIXED** |
| **BUG-03** | Custom Studio crashes with TypeError when no customizable products or variants exist | **MEDIUM** | P2 | `src/components/customStudio/CustomStudio.tsx` | **FIXED** |
| **BUG-04** | Guest checkout returns HTTP 401 RLS violation on `public.orders` insert | **CRITICAL** | P1 | Supabase Row Level Security | **DOCUMENTED / MIGRATION READY** |
| **BUG-05** | `localStorage is not defined` crash in Node/SSR during shipping calculation | **MEDIUM** | P2 | `src/services/shippingService.ts` | **FIXED** |
| **BUG-06** | Order service calls non-existent tables `payments` and `order_status_history` | **HIGH** | P1 | `src/services/orderService.ts` | **FIXED** |
| **BUG-07** | Product interface type mismatch missing `material` and `careInstructions` | **LOW** | P3 | `src/__tests__/`, `src/types/ecommerce.ts` | **FIXED** |
| **BUG-08** | Supabase order check constraint violation on `order_status` & missing admin sync | **CRITICAL** | P1 | `orderService.ts`, `adminService.ts`, `AdminDashboard.tsx` | **FIXED** |

---

## Detailed Defect Reports

### BUG-01: Order Creation Fails Due to Non-UUID IDs & Column Schema Mismatches
- **Severity:** Critical
- **Priority:** P1
- **Status:** FIXED
- **Root Cause:**
  1. The code generated arbitrary string prefixes (`ord-${Date.now()}` and `oi-${Date.now()}`), but the Supabase database schema strictly specifies `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`. PostgreSQL rejects non-UUID strings on insert with `invalid input syntax for type uuid`.
  2. The code attempted to insert `shipping_address`, `shipping_city`, `shipping_postal_code` as root columns into `orders`, but the actual database schema stores shipping details inside the `shipping_info` JSONB column.
  3. `order_items` insert attempted to map customization details to an unreferenced structure rather than the `customization_details` JSONB column.
- **Expected Behavior:** `orderService.ts` must generate valid RFC4122 UUIDs (`crypto.randomUUID()`) and nest shipping and customization details into their respective JSONB structures (`shipping_info`, `payment_record`, `customization_details`).
- **Actual Behavior (Before Fix):** Database insert failed with HTTP 400 Bad Request: `invalid input syntax for type uuid`.
- **Resolution:**
  - Updated `createOrder()` in `src/services/orderService.ts` to generate `crypto.randomUUID()`.
  - Conformed payload to `supabase_schema.sql` by properly populating `shipping_info` JSONB and `payment_record` JSONB.
  - Regression verified by `src/__tests__/order_security_pricing.test.ts`.

---

### BUG-02: Inventory Deduction Targets Obsolete Local Storage Key and Neglects Cloud Stock
- **Severity:** High
- **Priority:** P1
- **Status:** FIXED
- **Root Cause:** In `deductStockForOrder()`, the code targeted the legacy localStorage key `valknut_products` instead of the active canonical key `valknut_products_v2`. Furthermore, it only modified local browser storage without deducting stock from the live Supabase `product_variants.stock` table.
- **Expected Behavior:** When an order is placed, inventory must be deducted from both local cached catalog and the live Supabase `product_variants` database records.
- **Actual Behavior (Before Fix):** Local stock was deducted from a deprecated key (leaving active products unchanged), and Supabase variant inventory was never deducted, permitting overselling.
- **Resolution:**
  - Updated `deductStockForOrder()` to target `valknut_products_v2`.
  - Added direct cloud stock decrement targeting Supabase `product_variants` where `id = variant.id`.
  - Regression verified by `src/__tests__/order_security_pricing.test.ts`.

---

### BUG-03: Custom Studio Crashes with TypeError on Empty Catalog
- **Severity:** Medium
- **Priority:** P2
- **Status:** FIXED
- **Root Cause:** In `src/components/customStudio/CustomStudio.tsx`, the component attempted to access `activeProduct.variants[0].stock` without optional chaining. If the store had no products flagged `isCustomizable: true` or if variants was empty, the page crashed with `Cannot read properties of undefined (reading 'stock')`.
- **Expected Behavior:** If no customizable products exist, Custom Studio must display a graceful empty state and fallback product without crashing the application.
- **Actual Behavior (Before Fix):** Uncaught TypeError during initial render crashing the React view hierarchy.
- **Resolution:**
  - Added optional chaining (`activeProduct?.variants?.[0]?.price`) and default fallbacks.
  - Added an elegant empty state component prompting the user or admin to seed customizable garments.
  - Regression verified by `src/__tests__/custom_studio.test.ts`.

---

### BUG-04: Guest Checkout Blocked by Supabase Row Level Security (RLS)
- **Severity:** Critical
- **Priority:** P1
- **Status:** DOCUMENTED / MIGRATION READY
- **Root Cause:** The `orders` table in Supabase has Row Level Security enabled. The active policy permits authenticated users or admins to insert orders, but anonymous guests (`anon` key) receive `401 Unauthorized: violates row-level security policy for table "orders"`.
- **Expected Behavior:** Unauthenticated guest customers must be allowed to insert their placed orders into `public.orders` with `status = 'PENDING'`.
- **Actual Behavior (Before Fix):** Guest checkout fails with HTTP 401 when calling Supabase REST endpoint directly.
- **Resolution / Required Action:**
  Execute the following RLS policy in Supabase SQL Editor:
  ```sql
  -- Allow guest shoppers to insert orders with status PENDING
  CREATE POLICY "Public guest order creation permitted" 
  ON public.orders 
  FOR INSERT 
  TO anon 
  WITH CHECK (status = 'PENDING');

  -- Allow guest order items insertion
  CREATE POLICY "Public guest order items insert permitted" 
  ON public.order_items 
  FOR INSERT 
  TO anon 
  WITH CHECK (true);
  ```

---

### BUG-05: `localStorage is not defined` Runtime Crash in Node/SSR
- **Severity:** Medium
- **Priority:** P2
- **Status:** FIXED
- **Root Cause:** `src/services/shippingService.ts` called `localStorage.getItem('valknut_shipping_rates')` at module load time without checking `typeof window !== 'undefined'`. This crashed any headless test or server-side tool execution in Node.js.
- **Expected Behavior:** Local storage calls must be safely guarded for browser-only execution with safe in-memory fallback.
- **Actual Behavior (Before Fix):** `ReferenceError: localStorage is not defined` crashed the test runner.
- **Resolution:**
  - Added `if (typeof window !== 'undefined' && window.localStorage)` guards in `src/services/shippingService.ts`.
  - Regression verified by `npm test`.

---

### BUG-06: Order Service Calls Non-Existent Supabase Tables `payments` and `order_status_history`
- **Severity:** High
- **Priority:** P1
- **Status:** FIXED
- **Root Cause:** `orderService.ts` attempted to run secondary inserts into tables named `payments` and `order_status_history`. In the Supabase project schema (`urwhkkrozmlpadjmiqpc`), neither table exists; payment details are stored as a JSONB column `payment_record` on `orders`. These failed secondary inserts generated console errors and risked unhandled promise rejections.
- **Expected Behavior:** Order service should only query and mutate tables that exist in the active schema.
- **Actual Behavior (Before Fix):** Secondary API calls returned HTTP 404 Not Found.
- **Resolution:**
  - Removed calls to non-existent tables `payments` and `order_status_history`.
  - Persisted complete payment status and gateway transaction metadata inside `orders.payment_record` JSONB.
  - Regression verified by `npm test`.

---

### BUG-07: TypeScript Interface Drift in Test Product Mocks
- **Severity:** Low
- **Priority:** P3
- **Status:** FIXED
- **Root Cause:** The canonical `Product` interface in `src/types/ecommerce.ts` defines required properties `material: string` and `careInstructions: string`. Mock fixtures in test files omitted these properties, resulting in `tsc -b` compilation errors during production build.
- **Expected Behavior:** All mock objects must satisfy the strict TypeScript `Product` contract.
- **Actual Behavior (Before Fix):** `tsc -b` failed with TS2739.
- **Resolution:**
  - Added `material` and `careInstructions` to mock fixtures in `order_security_pricing.test.ts` and `product_catalog.test.ts`.
  - Both `npm test` (Vitest) and `npm run build` (`tsc -b && vite build`) now pass with 0 errors.

---

### BUG-08: Supabase Order Check Constraint Violation on `order_status` & Missing Admin Data Sync
- **Severity:** Critical
- **Priority:** P1
- **Status:** FIXED
- **Root Cause:**
  1. In PostgreSQL (`public.orders`), `order_status` has a check constraint: `CHECK (order_status IN ('Order Placed', 'Confirmed', 'In Production', 'Customizing Artwork', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'))`. `orderService.ts` was passing raw frontend statuses `'Pending'` and `'Payment Confirmed'`, which triggered PostgreSQL error: `new row for relation "orders" violates check constraint "orders_order_status_check"`. Because the database rejected the insert, no order row was saved to Supabase.
  2. Stock deduction queried `product_variants` by `id = item.variantId`. For products loaded without a joined variant table, synthetic variant IDs like `2fa21dc4-f38d-4665-95c6-37eb788cc098-s` were passed, triggering HTTP 400 `invalid input syntax for type uuid`.
  3. `getAllOrders()` only read from `localStorage` without querying Supabase `orders` table.
  4. In `AdminDashboard.tsx`, `customers` was only inferred from local `orders` and the currently logged-in user, and never queried Supabase `customer_profiles` table or registered accounts. Consequently, newly registered customers and placed orders did not appear in the Admin Portal.
- **Expected Behavior:** Orders must be inserted with database-compliant status values (`'Order Placed'`), variant queries must validate UUID syntax, and the Admin Portal must fetch and display real orders and customer profiles.
- **Actual Behavior (Before Fix):** Order insert failed with constraint violation, variant query returned 400, and Admin Portal showed 0 orders and only the admin account in Customers.
- **Resolution:**
  - Added bidirectional mappers `mapOrderStatusToDb`, `mapOrderStatusFromDb`, `mapPaymentStatusToDb`, and `mapPaymentStatusFromDb` in `src/services/orderService.ts`.
  - Added UUID regex validation in `deductStockForOrder` to query by `sku` when synthetic IDs are encountered.
  - Implemented `mapSupabaseOrderRowToOrder` and updated `getAllOrders()` to fetch remote orders with `order_items(*)`.
  - Added `fetchAdminCustomerProfiles()` in `src/services/adminService.ts` and updated `getAdminCustomersList()` to merge Supabase profiles, orders, and registered users.
  - Updated `StoreContext.tsx` to load `*, product_variants(*)` and cloud orders on mount.
  - Updated `AdminDashboard.tsx` to fetch and render live orders and customer profiles.
  - Verified live in browser: Customer `Test Buyer` registered, order `VK-2026-282348` placed, and verified both appearing in Admin Dashboard under Orders and Customers tabs.
