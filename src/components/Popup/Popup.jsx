import React, { useState, useContext } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import emailjs from "@emailjs/browser";
import { CartContext } from "../../context/CartContext";

const Popup = ({ orderPopup, setOrderPopup }) => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useContext(CartContext);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("email");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("Please add items to your cart!");
      return;
    }

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.zipCode
    ) {
      alert("Please fill in all fields!");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare order items for email
      const orderItems = cartItems
        .map((item) => `${item.title} (${item.color}) - Qty: ${item.quantity} x $${item.price} = $${(item.quantity * item.price).toFixed(2)}`)
        .join("\n");

      const totalPrice = getTotalPrice().toFixed(2);

      // Send order confirmation email via EmailJS
      await emailjs.send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: `${form.firstName} ${form.lastName}`,
          from_email: form.email,
          phone: form.phone,
          address: `${form.address}, ${form.city}, ${form.zipCode}`,
          order_items: orderItems,
          total_price: totalPrice,
          payment_method: paymentMethod,
          message: `New order from ${form.firstName} ${form.lastName}. Phone: ${form.phone}. Shipping Address: ${form.address}, ${form.city}, ${form.zipCode}.`,
          to_name: "CustomWear Store",
          to_email: "kennethfernandes113@gmail.com",
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      );

      // If payment method is Stripe, redirect to payment
      if (paymentMethod === "stripe") {
        // This will be implemented with Stripe integration
        alert("Stripe payment integration coming soon! For now, proceeding with email confirmation.");
      }

      alert("Order submitted successfully! Check your email for confirmation.");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
      });
      clearCart();
      setOrderPopup(false);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {orderPopup && (
        <div className="popup fixed inset-0 z-50">
          <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm overflow-y-auto">
            <div className="min-h-screen flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto duration-200">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 flex items-center justify-between p-4 border-b dark:border-gray-700">
                  <h1 className="text-2xl font-bold">Checkout</h1>
                  <IoCloseOutline
                    className="text-3xl cursor-pointer hover:text-primary"
                    onClick={() => setOrderPopup(false)}
                  />
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Cart Items */}
                  {cartItems.length > 0 ? (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold">Order Summary</h2>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3 max-h-48 overflow-y-auto">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded">
                            <div className="flex items-center gap-3 flex-1">
                              <img
                                src={item.img}
                                alt={item.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="font-semibold">{item.title}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {item.color} - ${item.price}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.id, item.quantity - 1)
                                }
                                className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-primary hover:text-white"
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.id, item.quantity + 1)
                                }
                                className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-primary hover:text-white"
                              >
                                +
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="ml-2 text-red-500 hover:text-red-700"
                              >
                                <MdDelete size={20} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold">Total:</span>
                          <span className="text-2xl font-bold text-primary">
                            ${getTotalPrice().toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-lg">
                        Your cart is empty. Please add items before ordering.
                      </p>
                    </div>
                  )}

                  {/* Shipping Form */}
                  {cartItems.length > 0 && (
                    <>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <h2 className="text-xl font-bold">Shipping Information</h2>

                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            className="col-span-1 rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-4 py-2"
                            value={form.firstName}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            className="col-span-1 rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-4 py-2"
                            value={form.lastName}
                            onChange={handleChange}
                          />
                        </div>

                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          className="w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-4 py-2"
                          value={form.email}
                          onChange={handleChange}
                        />

                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          className="w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-4 py-2"
                          value={form.phone}
                          onChange={handleChange}
                        />

                        <input
                          type="text"
                          name="address"
                          placeholder="Street Address"
                          className="w-full rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-4 py-2"
                          value={form.address}
                          onChange={handleChange}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            name="city"
                            placeholder="City"
                            className="rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-4 py-2"
                            value={form.city}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="zipCode"
                            placeholder="ZIP Code"
                            className="rounded-full border border-gray-300 dark:border-gray-500 dark:bg-gray-800 px-4 py-2"
                            value={form.zipCode}
                            onChange={handleChange}
                          />
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-3">
                          <h3 className="font-semibold">Payment Method</h3>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="payment"
                                value="email"
                                checked={paymentMethod === "email"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                              />
                              <span>Email Quote</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="payment"
                                value="stripe"
                                checked={paymentMethod === "stripe"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                              />
                              <span>Stripe Payment (Coming Soon)</span>
                            </label>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-3 px-4 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isLoading || cartItems.length === 0}
                        >
                          {isLoading ? "Processing..." : "Complete Order"}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
