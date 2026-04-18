# CustomWear Ecommerce - Quick Start Guide

## What's New

Your CustomWear site now has **real ecommerce features**:

✅ Shopping cart with add/remove/quantity control
✅ Product prices displayed
✅ Checkout form with shipping information
✅ Email order confirmations (automatically sent to customers and admin)
✅ Payment method selection (Email Quote + Stripe ready)
✅ Order management backend with MongoDB
✅ Stripe payment integration (configured, ready to activate)

---

## Quick Setup (5 minutes)

### Step 1: Get EmailJS Credentials
1. Go to emailjs.com and sign up for free
2. Connect your Gmail/email account
3. Create an email template (use template from ECOMMERCE_SETUP.md)
4. Copy Service ID, Template ID, and Public Key
5. Create `.env` file in project root:
```
VITE_APP_EMAILJS_SERVICE_ID=your_service_id
VITE_APP_EMAILJS_TEMPLATE_ID=your_template_id
VITE_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

### Step 2: Install Frontend Packages
```bash
npm install
npm run dev
```

### Step 3: (Optional) Setup Backend for Order Storage

If you want to use MongoDB to store all orders:

```bash
cd backend
npm install
```

Create `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/customwear
STRIPE_SECRET_KEY=sk_test_xxx
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@customwear.com
PORT=5000
```

Then run:
```bash
npm run dev
```

---

## How It Works

### Customer Journey:

1. **Browse Products** - See prices and ratings
2. **Add to Cart** - Click "Add to Cart" on any product
3. **Checkout** - Click checkout button, fills in shipping info
4. **Select Payment** - Choose "Email Quote" or "Stripe"
5. **Confirm Order** - Customers and admin both get email
6. **Track Order** - Later: can add order tracking page

### Admin Receives:
- Email notification with all order details
- Full customer information
- Shipping address
- Items ordered with prices

### Customer Receives:
- Order confirmation email
- Order ID and date
- Invoice with itemized list
- Total amount

---

## Features Included

### Frontend (Already Implemented)
- ✅ React Shopping Cart Context
- ✅ Product prices
- ✅ Add to Cart buttons
- ✅ Quantity adjustment
- ✅ Order total calculation
- ✅ Professional checkout form
- ✅ Email notifications via EmailJS
- ✅ Dark mode support

### Backend (Ready to Deploy)
- ✅ Express.js server
- ✅ MongoDB integration
- ✅ Order creation API
- ✅ Payment intent creation (Stripe)
- ✅ Email notifications (Nodemailer)
- ✅ Admin dashboard API endpoints
- ✅ CORS enabled

### Payments (Ready to Activate)
- ✅ Stripe Payment Intent API
- ✅ Order payment status tracking
- ✅ Payment failure handling

---

## Configuration Files

### Frontend
- **`.env`** - Add your EmailJS keys here
- **`src/context/CartContext.jsx`** - Shopping cart state management
- **`src/components/Popup/Popup.jsx`** - Checkout form
- **`src/components/Products/Products.jsx`** - Add to cart buttons

### Backend
- **`backend/.env`** - Database, email, payment keys
- **`backend/server.js`** - API routes and server logic
- **`backend/package.json`** - Dependencies

---

## Testing Checklist

- [ ] Add products to cart
- [ ] Adjust quantities
- [ ] Remove items
- [ ] See total update
- [ ] Fill shipping form
- [ ] Submit order
- [ ] Check email for confirmation
- [ ] Check admin email for order notification

---

## Next: Stripe Payment Setup

To enable actual credit card payments:

1. Get Stripe API keys from stripe.com
2. Add to `backend/.env`:
   ```
   STRIPE_PUBLIC_KEY=pk_test_xxx
   STRIPE_SECRET_KEY=sk_test_xxx
   ```
3. Update `Popup.jsx` to use Stripe Elements
4. Test with Stripe test card: 4242 4242 4242 4242

---

## Common Issues & Fixes

**Q: Emails not sending?**
- ✓ Check .env variables
- ✓ Verify EmailJS service is connected
- ✓ Check spam folder
- ✓ Generate new Gmail app password

**Q: Backend connection error?**
- ✓ Make sure backend is running: `npm run dev` in `/backend`
- ✓ Check PORT in .env (default 5000)
- ✓ Verify MONGODB_URI is correct

**Q: Cart not working?**
- ✓ Check browser console for errors
- ✓ Verify React is loading properly
- ✓ Clear browser cache

**Q: Form not validating?**
- ✓ All fields must be filled
- ✓ Phone must be valid phone format
- ✓ Email must be valid email

---

## Need Help?

Refer to **ECOMMERCE_SETUP.md** for detailed step-by-step instructions for:
- EmailJS configuration
- Stripe setup
- MongoDB Atlas setup
- Gmail app passwords
- Troubleshooting

---

## What's Next?

1. ✅ Implement shopping cart (DONE)
2. ✅ Add email notifications (DONE)
3. ⬜ Deploy backend to cloud (Heroku/Railway)
4. ⬜ Deploy frontend to cloud (Vercel/Netlify)
5. ⬜ Switch Stripe to production keys
6. ⬜ Add order tracking page
7. ⬜ Add inventory management
8. ⬜ Add product reviews/ratings

---

Created with ❤️ for CustomWear Ecommerce
