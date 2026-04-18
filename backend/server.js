import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import stripe from "stripe";
import nodemailer from "nodemailer";

// Load environment variables
dotenv.config();

const app = express();
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define Order Schema
const orderSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    zipCode: String,
    items: [
      {
        id: Number,
        title: String,
        color: String,
        price: Number,
        quantity: Number,
        img: String,
      },
    ],
    totalPrice: Number,
    paymentMethod: String,
    paymentStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "completed", "failed"],
    },
    stripePaymentId: String,
    orderStatus: {
      type: String,
      default: "confirmed",
      enum: ["confirmed", "processing", "shipped", "delivered", "cancelled"],
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

// Email Transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Routes

// Create Order
app.post("/api/orders", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      zipCode,
      items,
      totalPrice,
      paymentMethod,
    } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !zipCode ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create order
    const order = new Order({
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      zipCode,
      items,
      totalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === "email" ? "pending" : "processing",
    });

    await order.save();

    // Send confirmation email to customer
    const itemsList = items
      .map(
        (item) =>
          `<tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${item.title} (${item.color})</td>
        <td style="padding: 10px; border: 1px solid #ddd;">$${item.price}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
      )
      .join("");

    const customerEmailHtml = `
      <h2>Order Confirmation</h2>
      <p>Dear ${firstName} ${lastName},</p>
      <p>Thank you for your order! Here are your order details:</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
      
      <h3>Shipping Address:</h3>
      <p>${address}, ${city}, ${zipCode}</p>
      
      <h3>Items:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 10px; border: 1px solid #ddd;">Product</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Total</th>
        </tr>
        ${itemsList}
      </table>
      
      <p style="margin-top: 20px; font-size: 18px;"><strong>Total: $${totalPrice.toFixed(2)}</strong></p>
      <p>Payment Method: ${paymentMethod === "email" ? "Email Quote" : "Credit Card"}</p>
      
      <p>We will contact you shortly with shipping details. Thank you for shopping with CustomWear!</p>
    `;

    // Send email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Order Confirmation #${order._id}`,
      html: customerEmailHtml,
    });

    // Send notification to admin
    const adminEmailHtml = `
      <h2>New Order Received</h2>
      <p><strong>Customer Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Shipping Address:</strong> ${address}, ${city}, ${zipCode}</p>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total:</strong> $${totalPrice.toFixed(2)}</p>
      <p><strong>Payment Method:</strong> ${paymentMethod}</p>
      <h3>Items:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 10px; border: 1px solid #ddd;">Product</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Color</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Qty</th>
          <th style="padding: 10px; border: 1px solid #ddd;">Total</th>
        </tr>
        ${items.map((item) => `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.title}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.color}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">$${item.price}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join("")}
      </table>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order #${order._id}`,
      html: adminEmailHtml,
    });

    res.status(201).json({
      message: "Order created successfully",
      order: order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get All Orders (for admin)
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Order Details
app.get("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Stripe Payment Intent
app.post("/api/payment-intent", async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: { orderId },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Order Payment Status
app.patch("/api/orders/:id/payment", async (req, res) => {
  try {
    const { paymentStatus, stripePaymentId } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, stripePaymentId },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Order Status
app.patch("/api/orders/:id/status", async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
