import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { amount, donor } = req.body;
    console.log("Amount : ", amount, "Donor : ", donor);
    if (!amount || amount < 1) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    console.log("fix");
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `don_${Date.now()}`,
      notes: {
        donorName: donor.name,
        donorEmail: donor.email,
      },
    });

    res.status(200).json({
      o_id: order.id,
      o_amount: order.amount,
      o_currency: order.currency,
    });
  } catch (err) {
    console.log("Error : ", err);
    res.status(500).json({ message: "Failed to create an order", err });
  }
};

export const verifyOrder = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Verification failed : ", err });
  }
};
