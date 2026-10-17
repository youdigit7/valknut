# VALKNUT Official — Master Test Data & Fixtures (QA-TD-01)

## 1. Overview & Data Security Guidelines

This document specifies the standard test personas, fixtures, and datasets for automated, integration, and manual QA validation of **VALKNUT Official** (`valknutofficial.com`).

### Strict Data Isolation Rules
1. **No Production Customer Data:** Never test using genuine customer email addresses, real telephone numbers, or private delivery addresses.
2. **No Real Financial Transactions:** Use mock payment tokens or official gateway sandbox credentials only.
3. **Dedicated Admin Test Account:** Only the designated store test admin account is used for privileged CRUD operations.

---

## 2. Test Personas & Credentials

| Persona ID | Role | Email | Password | Supabase UID | Permissions |
|---|---|---|---|---|---|
| **USR-ADMIN-01** | Super Admin | `valknutofficial4@gmail.com` | `123456` | `13395bcb-aba5-4b9a-b4a7-08533717e6e9` | Full CRUD on products, orders, media |
| **USR-CUST-01** | Registered Customer | `qa.testcustomer.valknut@gmail.com` | `Valknut@2026!` | `d720c7b3-8b71-4ce8-b6dc-d5c2250ea101` | Read catalog, create orders, view own profile |
| **USR-GUEST-01** | Anonymous Guest | N/A (Unauthenticated) | N/A | N/A | Public browsing, add to cart, guest checkout |

---

## 3. Product Fixtures

### Fixture PROD-01: Standard Available Heavyweight Tee
```json
{
  "id": "2fa21dc4-f38d-4665-95c6-37eb788cc098",
  "name": "TEST // VALKNUT ARCHETYPE TEE",
  "slug": "test-valknut-archetype-tee",
  "description": "280 GSM heavyweight custom combed cotton tee with reinforced ribbed collar.",
  "material": "100% Combed Heavyweight Cotton",
  "careInstructions": "Machine wash cold inside out. Do not tumble dry.",
  "price": 8500,
  "salePrice": null,
  "category": "MEN",
  "subCategory": "Oversized T-Shirts",
  "collection": "ARCHETYPE 2026",
  "images": [
    "https://res.cloudinary.com/ofrariny/image/upload/v1792186461/valknut/adyecc19detj4eacowf5.png"
  ],
  "tags": ["Oversized", "Heavyweight", "Archetype"],
  "variants": [
    {
      "id": "44c631f3-9f65-4ad2-8a2d-54bcb540290d",
      "size": "M",
      "color": "Onyx Black",
      "colorHex": "#0A0A0A",
      "sku": "VK-ARCH-TEE-M",
      "stock": 25
    }
  ],
  "isCustomizable": false,
  "isBestSeller": true,
  "isNewArrival": true,
  "isFeatured": true,
  "createdAt": "2026-10-16T12:00:00Z"
}
```

### Fixture PROD-02: Multi-Variant & Sale Hoodie
```json
{
  "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "name": "TEST // VALKNUT SHADOW HOODIE",
  "slug": "test-valknut-shadow-hoodie",
  "description": "450 GSM French Terry luxury heavyweight pullover with double-lined hood.",
  "material": "100% French Terry Cotton",
  "careInstructions": "Dry clean or hand wash cold.",
  "price": 14500,
  "salePrice": 12500,
  "category": "MEN",
  "subCategory": "Hoodies",
  "collection": "SHADOW OPS",
  "images": [
    "https://res.cloudinary.com/ofrariny/image/upload/v1792177103/valknut/fh5iiissseg7njxt2o0e.jpg"
  ],
  "tags": ["Hoodie", "French Terry", "Winter"],
  "variants": [
    {
      "id": "v-hoodie-s",
      "size": "S",
      "color": "Washed Charcoal",
      "colorHex": "#2A2A2A",
      "sku": "VK-SHDW-HD-S",
      "stock": 10
    },
    {
      "id": "v-hoodie-m",
      "size": "M",
      "color": "Washed Charcoal",
      "colorHex": "#2A2A2A",
      "sku": "VK-SHDW-HD-M",
      "stock": 15
    },
    {
      "id": "v-hoodie-l",
      "size": "L",
      "color": "Washed Charcoal",
      "colorHex": "#2A2A2A",
      "sku": "VK-SHDW-HD-L",
      "stock": 0
    }
  ],
  "isCustomizable": false,
  "isBestSeller": false,
  "isNewArrival": true,
  "isFeatured": true,
  "createdAt": "2026-10-16T14:30:00Z"
}
```

### Fixture PROD-03: Out-of-Stock Product
```json
{
  "id": "f9e8d7c6-b5a4-3210-fedc-ba9876543210",
  "name": "TEST // VALKNUT ARCHIVE CARGO PANT",
  "slug": "test-valknut-archive-cargo-pant",
  "description": "Technical ripstop cargo pants with magnetic fidlock buckles.",
  "material": "Ripstop Cotton / Nylon Blend",
  "careInstructions": "Machine wash delicate.",
  "price": 16500,
  "salePrice": null,
  "category": "MEN",
  "subCategory": "Pants",
  "collection": "ARCHIVE",
  "images": [
    "https://res.cloudinary.com/ofrariny/image/upload/v1792186461/valknut/adyecc19detj4eacowf5.png"
  ],
  "tags": ["Cargo", "Technical", "Sold Out"],
  "variants": [
    {
      "id": "v-cargo-30",
      "size": "30",
      "color": "Olive Drab",
      "colorHex": "#3B4A3F",
      "sku": "VK-CRG-30",
      "stock": 0
    }
  ],
  "isCustomizable": false,
  "isBestSeller": false,
  "isNewArrival": false,
  "isFeatured": false,
  "createdAt": "2026-09-01T00:00:00Z"
}
```

### Fixture PROD-04: Customizable Studio Garment
```json
{
  "id": "c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f",
  "name": "TEST // VALKNUT CUSTOM STUDIO CANVAS TEE",
  "slug": "test-valknut-custom-studio-canvas-tee",
  "description": "Blank luxury 300 GSM cotton canvas engineered specifically for high-definition direct-to-garment printing and precision embroidery.",
  "material": "100% Combed Ringspun Cotton",
  "careInstructions": "Wash cold inside out. Do not iron directly on custom artwork.",
  "price": 9500,
  "salePrice": null,
  "category": "CUSTOM_STUDIO",
  "subCategory": "Custom Tees",
  "collection": "STUDIO LAB",
  "images": [
    "https://res.cloudinary.com/ofrariny/image/upload/v1792186461/valknut/adyecc19detj4eacowf5.png"
  ],
  "tags": ["Customizable", "Studio", "DTG"],
  "variants": [
    {
      "id": "v-cust-m-blk",
      "size": "M",
      "color": "Pitch Black",
      "colorHex": "#000000",
      "sku": "VK-CUST-M-BLK",
      "stock": 50
    },
    {
      "id": "v-cust-l-wht",
      "size": "L",
      "color": "Raw Chalk",
      "colorHex": "#F5F5F0",
      "sku": "VK-CUST-L-WHT",
      "stock": 50
    }
  ],
  "isCustomizable": true,
  "isBestSeller": true,
  "isNewArrival": true,
  "isFeatured": true,
  "createdAt": "2026-10-10T10:00:00Z"
}
```

---

## 4. Coupon Fixtures

| Code | Type | Discount Value | Min Order (LKR) | Expiry Date | Status |
|---|---|---|---|---|---|
| `VALKNUT10` | PERCENTAGE | 10% | 5,000 | 2026-12-31 | Active |
| `VALKNUT2000` | FIXED_AMOUNT | 2,000 LKR | 15,000 | 2026-12-31 | Active |
| `VIPEXPIRED` | PERCENTAGE | 25% | 1,000 | 2025-01-01 | Expired |
| `MINCARTFAIL` | FIXED_AMOUNT | 1,000 LKR | 20,000 | 2026-12-31 | Active (High min) |

---

## 5. Shipping & Address Fixtures

### Address 1: Western Province (Standard Delivery)
```json
{
  "fullName": "Kasun Perera",
  "phone": "+94771234567",
  "email": "kasun.test@valknutofficial.com",
  "streetAddress": "No. 45, Alfred Place",
  "city": "Colombo 03",
  "province": "Western Province",
  "postalCode": "00300",
  "country": "Sri Lanka"
}
```
- *Shipping Expected:* Subtotal < 10,000 LKR = **450 LKR**; Subtotal >= 10,000 LKR = **0 LKR (FREE)**.

### Address 2: Outstation (Kandy, Central Province)
```json
{
  "fullName": "Saman Kumara",
  "phone": "+94719876543",
  "email": "saman.test@valknutofficial.com",
  "streetAddress": "No. 12/B, Peradeniya Road",
  "city": "Kandy",
  "province": "Central Province",
  "postalCode": "20000",
  "country": "Sri Lanka"
}
```
- *Shipping Expected:* Express Courier Option = **850 LKR**.

---

## 6. Test Order Payload (Conforming to Supabase Schema)

```json
{
  "id": "e4f3a2b1-0987-4654-ba98-fedcba098765",
  "customer_id": null,
  "status": "PENDING",
  "payment_method": "BANK_DEPOSIT",
  "payment_status": "PENDING",
  "subtotal": 8500,
  "shipping_fee": 450,
  "discount": 0,
  "total": 8950,
  "coupon_code": null,
  "notes": "QA Test Automated Order",
  "shipping_info": {
    "fullName": "Kasun Perera",
    "phone": "+94771234567",
    "email": "kasun.test@valknutofficial.com",
    "streetAddress": "No. 45, Alfred Place",
    "city": "Colombo 03",
    "province": "Western Province",
    "postalCode": "00300",
    "deliveryMethod": "STANDARD"
  },
  "payment_record": {
    "gateway": "BANK_DEPOSIT",
    "currency": "LKR",
    "amount": 8950,
    "reference": "DEP-TEST-20261016"
  },
  "created_at": "2026-10-16T21:30:00Z"
}
```
