// paymentController.js
import stripe from '../libs/stripeConfig.js';
import Cart from '../models/cartModel.js';


export const createSessionStripe = async (req, res) => {
  const { cartId } = req.body;

  try {
    const cart = await Cart.findById(cartId).populate('items.product');
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    const lineItems = cart.items.map((item) => {
      const product = item.product;
      return {
        price_data: {
          currency: 'pen',
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
        quantity: item.quantity,
      };
    });

    const totalAmount = cart.items.reduce((total, item) => total + item.quantity * item.product.price * 100, 0);
    console.log(totalAmount);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['PE'],
      },
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
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
      phone_number_collection: {
        enabled: true,
      },
      client_reference_id: 'your_client_id_here',
      customer_email: 'customer@example.com',
      metadata: {
        orderId: '12345',
        notes: 'Special instructions for the order',
      },
    });
    res.json(session);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}

// export const createSessionStripe = async (req, res) => {
//   const { cartId, user } = req.body;

//   try {
//     const cart = await Cart.findById(cartId).populate('items.product');
//     if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

//     const lineItems = cart.items.map((item) => {
//       const product = item.product;
//       return {
//         price_data: {
//           currency: 'pen',
//           product_data: {
//             name: product.name,
//           },
//           unit_amount: product.price * 100,
//         },
//         quantity: item.quantity,
//       };
//     });

//     const totalAmount = cart.items.reduce((total, item) => total + item.quantity * item.product.price * 100, 0);
//     console.log(totalAmount);

//     const orderNumberCounter = await OrderNumber.findOneAndUpdate(
//       { name: 'orderCounter' },
//       { $inc: { value: 1 } },
//       { new: true, upsert: true }
//     );
//     const formattedOrderNumber = `CN${String(orderNumberCounter.value).padStart(7, '0')}`;

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       shipping_address_collection: {
//         allowed_countries: ['PE'],
//       },
//       shipping_options: [
//         // ... (shipping options)
//       ],
//       line_items: lineItems,
//       mode: 'payment',
//       success_url: 'http://localhost:3000/success',
//       cancel_url: 'http://localhost:3000/cancel',
//       phone_number_collection: {
//         enabled: true,
//       },
//       client_reference_id: formattedOrderNumber, // Use the order number as client reference
//       customer_email: user ? user.email : 'customer@example.com',
//       metadata: {
//         orderId: formattedOrderNumber, // Use the order number as orderId
//         notes: 'Special instructions for the order',
//       },
//     });

//     const itemsWithPrice = cart.items.map((item) => {
//       const product = item.product;
//       return {
//         product: product._id,
//         quantity: item.quantity,
//         price: product.price,
//       };
//     });

//     const totalAmountForOrder = itemsWithPrice.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     );

//     const order = await Order.create({
//       user: user ? user._id : null,
//       items: itemsWithPrice,
//       totalAmount: totalAmountForOrder,
//       nroOrder: formattedOrderNumber,
//     });

//     if (user) {
//       cart.items = [];
//       await cart.save();
//     } else {
//       res.clearCookie('tempCartId');
//       res.clearCookie('cart');
//     }

//     res.json(session);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: 'Something went wrong' });
//   }
// };
