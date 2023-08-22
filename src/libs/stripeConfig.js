import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../config.js';

const stripeConfig = Stripe(STRIPE_SECRET_KEY);

export default stripeConfig;