import Stripe from '../libs/stripeConfig.js';
import { FRONTEND_URL_LOCAL, STRIPE_ENDPOINT_SECRET } from '../config.js';
import { createOrder } from './orderController.js';
import Product from '../models/productModel.js';
import { sendEmail } from './emailSender.js';
import { emailTemplate } from '../utils/emailTemplate.js';

export const createSession = async (req, res) => {
  const { cart, user } = req;

  if (!cart.items || cart.items.length === 0)
    return res.status(400).json({ message: 'El carrito está vacío' });

  try {
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
    const productIds = cart.items.map((item) => item.product);
    const products = await Product.find({
      _id: { $in: productIds },
    });

    const customer = await Stripe.customers.create({
      metadata: {
        userId: user ? user.id : null,
        cart: JSON.stringify(cart),
      },
    });
    // console.log('customer: ', customer);

    const lineItems = cart.items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.product.toString());
      return {
        price_data: {
          currency: 'pen',
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
          metadata: {
            id: product._id,
          },
        },
        quantity: item.quantity,
      };
    });

    const session = await Stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['PE'],
      },
      invoice_creation: {
        enabled: true,
      },
      // invoice_creation: {
      //   enabled: true,
      //   invoice_data: {
      //     description: 'Invoice for Product X',
      //     metadata: {
      //       order: 'order-xyz',
      //     },
      //   },
      // },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'pen',
            },
            display_name: 'Regojo en tienda',
            delivery_estimate: {
              minimum: {
                unit: 'hour',
                value: 1,
              },
              maximum: {
                unit: 'hour',
                value: 1,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500,
              currency: 'pen',
            },
            display_name: 'Envío a domicilio',
            delivery_estimate: {
              minimum: {
                unit: 'hour',
                value: 1,
              },
              maximum: {
                unit: 'hour',
                value: 2,
              },
            },
          },
        },
      ],
      line_items: lineItems,
      mode: 'payment',
      customer: customer.id,
      phone_number_collection: {
        enabled: true,
      },
      // success_url: 'http://localhost:3000/success',
      success_url: `${FRONTEND_URL_LOCAL}/checkout-success`,
      cancel_url: `${FRONTEND_URL_LOCAL}/carrito`,
    });
    // if (!user) {
    //   res.clearCookie('tempCartId');
    //   res.clearCookie('cart');
    // }
    // console.log(session);
    res.json(session);
    // res.send({ url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const webhook = async (req, res) => {
  const endpointSecret = STRIPE_ENDPOINT_SECRET;
  const sig = req.headers['stripe-signature'];
  const rawBody = req.body;

  let data;
  let eventType;

  if (endpointSecret) {
    let event;
    try {
      event = Stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
      console.log('Webhook event received:', event.type);
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    // console.log('dataEvent: ', data);
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }

  try {
    switch (eventType) {
      case 'checkout.session.completed':
        console.log('creando orden...');
        break;
      case 'checkout.session.async_payment_failed':
      case 'checkout.session.payment_failed':
        await handleFailedPayment(data);
        break;
      case 'invoice.sent':
        await handleCompletedPayment(data);
        const invoiceLink = data.hosted_invoice_url;
        const customerEmail = data.customer_email;
        const customerName = data.customer_name;
        const words = customerName.split(' ');
        const name = words[0];

        const htmlContent = emailTemplate(name, invoiceLink);
        sendEmail(customerEmail, 'Comprobante de Pago - CREPESAMOR', htmlContent);

        res.status(200).json({ invoiceLink });
        return;
      default:
        console.log('Unhandled event type:', eventType);
    }

    res.status(200).send('Webhook successfully processed.');
  } catch (err) {
    console.log('Error handling event:', err);
    res.status(500).send('Internal server error.');
  }
};

const handleCompletedPayment = async (data) => {
  const customerId = data.customer;
  const customer = await Stripe.customers.retrieve(customerId);
  await createOrder(customer, data);
};

const handleFailedPayment = async (data) => {
  const customerId = data.customer;
  console.log(customerId);
};
