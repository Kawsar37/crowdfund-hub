const Payment = require('../models/Payment');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const CREDIT_PACKAGES = {
  '100': { credits: 100, price: 10, name: '100 Credits' },
  '300': { credits: 300, price: 25, name: '300 Credits' },
  '800': { credits: 800, price: 60, name: '800 Credits' },
  '1500': { credits: 1500, price: 110, name: '1500 Credits' }
};

exports.createCheckoutSession = async (req, res) => {
  try {
    const { packageKey } = req.body;
    const pkg = CREDIT_PACKAGES[packageKey];

    if (!pkg) {
      return res.status(400).json({ message: 'Invalid package.' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${pkg.name} - CrowdPulse Credits`,
            description: `Purchase ${pkg.credits} credits for $${pkg.price}`
          },
          unit_amount: pkg.price * 100
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/dashboard/supporter/payment-history?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard/supporter/purchase-credit`,
      metadata: {
        user_email: req.user.user_email,
        user_name: req.user.display_name,
        credits: pkg.credits.toString(),
        package_name: pkg.name
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create checkout session.', error: error.message });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { user_email, user_name, credits, package_name } = session.metadata;

      // Add credits to user
      await User.findOneAndUpdate(
        { user_email },
        { $inc: { credits: Number(credits) } }
      );

      // Save payment record
      await Payment.create({
        user_email,
        user_name,
        amount: session.amount_total / 100,
        credits_purchased: Number(credits),
        package_name,
        stripe_payment_id: session.payment_intent,
        status: 'completed'
      });
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(400).json({ message: `Webhook Error: ${error.message}` });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user_email: req.user.user_email })
      .sort({ payment_date: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payments.', error: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ payment_date: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payments.', error: error.message });
  }
};

// Dummy payment for testing without Stripe
exports.dummyPayment = async (req, res) => {
  try {
    const { packageKey } = req.body;
    const pkg = CREDIT_PACKAGES[packageKey];

    if (!pkg) {
      return res.status(400).json({ message: 'Invalid package.' });
    }

    // Add credits to user
    await User.findOneAndUpdate(
      { user_email: req.user.user_email },
      { $inc: { credits: pkg.credits } }
    );

    // Save payment record
    const payment = await Payment.create({
      user_email: req.user.user_email,
      user_name: req.user.display_name,
      amount: pkg.price,
      credits_purchased: pkg.credits,
      package_name: pkg.name,
      stripe_payment_id: `dummy_${Date.now()}`,
      status: 'completed'
    });

    res.json({ message: 'Payment successful', payment });
  } catch (error) {
    res.status(500).json({ message: 'Payment failed.', error: error.message });
  }
};

exports.verifySession = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) {
      return res.status(400).json({ message: 'session_id is required.' });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed.', status: session.payment_status });
    }

    const { user_email, user_name, credits, package_name } = session.metadata;

    // Check if payment record already exists (webhook already processed)
    const existingPayment = await Payment.findOne({ stripe_payment_id: session.payment_intent });
    if (existingPayment) {
      const user = await User.findOne({ user_email });
      return res.json({ message: 'Payment already processed.', credits: user?.credits || 0, alreadyProcessed: true });
    }

    // Webhook missed — manually add credits
    await User.findOneAndUpdate(
      { user_email },
      { $inc: { credits: Number(credits) } }
    );

    await Payment.create({
      user_email,
      user_name,
      amount: session.amount_total / 100,
      credits_purchased: Number(credits),
      package_name,
      stripe_payment_id: session.payment_intent,
      status: 'completed'
    });

    const user = await User.findOne({ user_email });
    res.json({ message: 'Credits added successfully.', credits: user?.credits || 0, alreadyProcessed: false });
  } catch (error) {
    res.status(500).json({ message: 'Failed to verify session.', error: error.message });
  }
};

exports.getCredits = async (req, res) => {
  res.json(CREDIT_PACKAGES);
};
