# SMS Gateway Recommendation & Setup Guide for VALKNUT
**Prepared for:** VALKNUT Store Owner / Executive Management  
**Project:** VALKNUT Official E-Commerce Store (Sri Lanka)  
**Purpose:** Customer Mobile Number OTP Verification & Order Updates  

---

## 1. Executive Summary & Top Recommendations

For a Sri Lankan luxury e-commerce brand, using international SMS providers like Twilio is **cost-prohibitive** (Rs. 15–20 per SMS). Local Sri Lankan SMS gateways cost **under Rs. 1.00 per SMS**, deliver messages in 2 to 5 seconds across all local networks (Dialog, Mobitel, Airtel, Hutch), and allow sending SMS with your custom Sender ID (e.g., `VALKNUT`).

Here are the top 3 recommended providers in Sri Lanka:

| Gateway | Best For | Estimated Cost / SMS | Masking / Sender ID | Ease of Setup |
| :--- | :--- | :--- | :--- | :--- |
| **1. Notify.lk (Top Choice)** | Startups & Modern E-Commerce | **Rs. 0.65 – 0.85** | Yes (`VALKNUT`) | Instant signup, fastest REST API |
| **2. Textware (DirectFN)** | High-Volume Enterprise | **Rs. 0.50 – 0.70** | Yes (`VALKNUT`) | Requires business registration documents |
| **3. Dialog IdeaBiz** | Telco-Direct Route | **Rs. 0.75 – 0.90** | Yes (`VALKNUT`) | Enterprise telco contract |

---

## 2. Why We Recommend **Notify.lk** as the #1 Choice

1. **Instant Activation:** You can create an account, recharge with a credit card, and start testing in 10 minutes.
2. **Pre-paid Wallet:** No monthly lock-in contracts or minimum commitments. You can start by loading Rs. 1,000 or Rs. 2,500.
3. **Custom Sender ID (Masking):** Customers receive SMS from **"VALKNUT"** instead of an unknown mobile number, maintaining luxury brand trust.
4. **Developer-Friendly REST API:** Directly integrates into our website's Supabase backend within hours.

---

## 3. Step-by-Step Guide for the Store Owner to Purchase & Setup

Please follow these 4 simple steps to purchase and activate the SMS Gateway:

### Step 1: Create an Account
1. Visit: **[https://notify.lk](https://notify.lk)**
2. Click **Get Started / Register**.
3. Sign up using your business email: `valknutofficial4@gmail.com` (or your company email).
4. Verify your email address and log in to the Notify.lk dashboard.

### Step 2: Recharge the SMS Wallet
1. In the dashboard, click **Billing** or **Add Credits**.
2. Select your top-up amount (e.g., **LKR 2,500** will provide approximately **3,000 to 3,500 OTP / Order SMS messages**).
3. Pay securely online using any Sri Lankan debit/credit card.

### Step 3: Request Custom Sender Masking (e.g., "VALKNUT")
1. Go to **Sender IDs / Masking** in the Notify.lk dashboard.
2. Click **Request New Sender ID**.
3. Enter requested Sender ID: **`VALKNUT`** (Max 11 characters, uppercase letters only).
4. You will be asked to upload:
   - Business Registration (BR) certificate (or National Identity Card if operating as an individual).
   - A short letter on company letterhead authorizing Notify.lk to broadcast SMS under the name `VALKNUT` (TRCSL telecommunication regulation requirement).
   *Note: Masking approval usually takes 24–48 hours by telecommunication operators. In the meantime, the default test sender ID can be used immediately for development.*

### Step 4: Share API Credentials with the Developer
Once your account is created, go to **Settings** → **API Keys** in the Notify.lk dashboard and copy:
1. **User ID / Account ID**
2. **API Key**
3. **Sender ID** (Default or approved `VALKNUT`)

Send these 3 details to your development team.

---

## 4. What Happens Once Credentials Are Provided?
Once the developer receives the API key, the website will automatically:
1. Provide a clean phone number input field (`+94 7X XXX XXXX`) on the sign-up and checkout screens.
2. Send an instant 6-digit verification code with the text:  
   > *"Your VALKNUT verification code is 123456. Valid for 5 minutes. Do not share this code."*
3. Allow customers to log in and confirm orders seamlessly without needing email verification.
