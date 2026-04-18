# CustomWear Ecommerce Setup Instructions

This document provides step-by-step instructions to set up your real ecommerce site with payment processing, order management, and email notifications.

## Table of Contents
1. [Frontend Setup](#frontend-setup)
2. [Backend Setup](#backend-setup)
3. [EmailJS Configuration](#emailjs-configuration)
4. [Stripe Configuration](#stripe-configuration)
5. [MongoDB Setup](#mongodb-setup)
6. [Running the Application](#running-the-application)

---

## Frontend Setup

### 1. Install Frontend Dependencies

Navigate to the project root and install dependencies:

```bash
npm install
```

### 2. Create Environment File

Create a `.env` file in the frontend root directory with:

```env
VITE_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_APP_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_APP_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
VITE_API_URL=http://localhost:5000/api
```

---

## Backend Setup

### 1. Install Backend Dependencies

Navigate to the backend folder:

```bash
cd backend
npm install
```

### 2. Create Environment File

Create a `.env` file in the `backend/` directory with all required variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/customwear
STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@customwear.com
PORT=5000
NODE_ENV=development
```

---

## EmailJS Configuration

EmailJS allows you to send emails directly from your frontend without a backend server. It's already integrated in the popup component.

### 1. Sign Up for EmailJS

- Go to [EmailJS.com](https://www.emailjs.com/)
- Click "Sign Up"
- Create an account using email/password or OAuth

### 2. Add Email Service

- In the EmailJS dashboard, go to **Email Services**
- Click "Add Service"
- Choose your email provider (Gmail, Outlook, etc.)
- Connect your email account

### 3. Create Email Template

- Go to **Email Templates**
- Click "Create New Template"
- Use this template structure:

```
Subject: Order Confirmation #{to_email}

Hello {{to_name}},

You have received a new order from {{from_name}} ({{from_email}}).

Customer Phone: {{phone}}
Shipping Address: {{address}}

Items Ordered:
{{order_items}}

Total Amount: ${{total_price}}
Payment Method: {{payment_method}}

Best regards,
CustomWear Team
```

### 4. Get Your Credentials

- Go to **Account** > **API Keys**
- Copy your:
  - **Service ID**
  - **Template ID** (from Email Templates)
  - **Public Key**

### 5. Add to .env File

```env
VITE_APP_EMAILJS_SERVICE_ID=service_xxxxx
VITE_APP_EMAILJS_TEMPLATE_ID=template_xxxxx
VITE_APP_EMAILJS_PUBLIC_KEY=public_xxxxx
```

---

## Stripe Configuration

Stripe handles payment processing securely.

### 1. Create Stripe Account

- Go to [Stripe.com](https://stripe.com/)
- Click "Start now"
- Sign up with your email
- Complete verification

### 2. Get API Keys

- Go to **Developers** > **API Keys**
- You'll see two key pairs:
  - **Publishable Key** (starts with `pk_`)
  - **Secret Key** (starts with `sk_`)

### 3. Add to Backend .env

```env
STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
```

### 4. Install Stripe in Frontend (Optional - for direct payment)

If you want to add direct Stripe payment from frontend:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

---

## MongoDB Setup

MongoDB stores all your orders and customer data.

### Option A: MongoDB Atlas (Cloud - Recommended)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Click "Try Free"
   - Sign up with email

2. **Create Cluster**
   - Choose "M0 Sandbox" (free tier)
   - Select a region close to you
   - Click "Create Cluster"

3. **Create Database User**
   - Go to **Database Access**
   - Click "Add New Database User"
   - Set username and password
   - Add a strong password

4. **Get Connection String**
   - Go to **Databases**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace username and password with your database user credentials

5. **Add to .env**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/customwear
   ```

### Option B: Local MongoDB

1. **Install MongoDB**
   - Download from [MongoDB.com](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Add to .env**
   ```env
   MONGODB_URI=mongodb://localhost:27017/customwear
   ```

---

## Email Setup (Backend Notifications)

The backend sends email notifications using Nodemailer.

### For Gmail:

1. **Enable 2-Factor Authentication**
   - Go to myaccount.google.com
   - Security settings
   - Enable 2-step verification

2. **Generate App Password**
   - Go to myaccount.google.com/apppasswords
   - Select Mail and Windows Computer (or your device)
   - Google will generate a 16-character password

3. **Add to .env**
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  (the generated password)
   ADMIN_EMAIL=admin@customwear.com
   ```

### For Other Email Services:

Update the `EMAIL_SERVICE` in .env with values like:
- `outlook`
- `yahoo`
- `icloud`
- Custom SMTP settings

---

## Running the Application

### 1. Start Backend Server

```bash
cd backend
npm install
npm run dev
```

Expected output:
```
Server running on port 5000
Connected to MongoDB
```

### 2. Start Frontend Development Server (in another terminal)

```bash
npm run dev
```

Expected output:
```
  VITE v5.0.10  ready in 800 ms
  ➜  Local:   http://localhost:5173/CustomWear
```

### 3. Test the Application

1. Open http://localhost:5173/CustomWear in your browser
2. Click "Add to Cart" on products
3. Click "Checkout" button
4. Fill in the order form
5. Choose payment method (Email Quote or Stripe)
6. Click "Complete Order"
7. Check your email for order confirmation

---

## Troubleshooting

### EmailJS not working
- Verify Service ID, Template ID, and Public Key in .env
- Check that email service is connected in EmailJS dashboard
- Verify template variables match the code

### Stripe errors
- Make sure you're using test keys (pk_test_* and sk_test_*)
- Check that Stripe keys are added to backend .env

### MongoDB connection failed
- Verify connection string is correct
- Check if MongoDB Atlas cluster is running
- Verify firewall allows your IP (add 0.0.0.0/0 for testing)

### Email not sending
- Verify email credentials
- Check spam folder
- Generate new Gmail app password if using Gmail
- Verify email service is connected to Nodemailer

### Orders not appearing in database
- Check MongoDB connection in console
- Verify database user has proper permissions
- Check backend logs for errors

---

## Next Steps

1. **Customize** product catalog
2. **Add** shipping cost calculations
3. **Implement** order tracking page
4. **Set up** email notifications for order updates
5. **Add** inventory management
6. **Deploy** frontend to Vercel/Netlify
7. **Deploy** backend to Heroku/Railway
8. **Go Live** with Stripe Production Keys

---

## Files Modified

- `src/components/Popup/Popup.jsx` - Enhanced checkout form
- `src/components/Products/Products.jsx` - Add to cart functionality
- `src/components/TopProducts/TopProducts.jsx` - Product prices
- `src/context/CartContext.jsx` - Shopping cart state management
- `src/App.jsx` - CartProvider integration
- `backend/server.js` - Backend API
- `backend/package.json` - Backend dependencies

---

## Support

For more help:
- EmailJS Docs: https://www.emailjs.com/docs/
- Stripe Docs: https://stripe.com/docs
- MongoDB Docs: https://docs.mongodb.com/
- Express Docs: https://expressjs.com/

