"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderEvent = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripeKey = process.env.STRIPE_TEST_KEY;
const stripeLiveKey = process.env.STRIPE_LIVE_KEY;
const confUrl = process.env.CONF_ORDER_URL;
const rejUrl = process.env.REJ_ORDER_URL;
const webhookSecret = process.env.WEBHOOK_SECRET;
const stripe = new stripe_1.default(stripeLiveKey, { apiVersion: '2022-11-15' });
async function orderEvent(req, rep) {
    const event = req.body;
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['sepa_debit', 'card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: event.name,
                        },
                        unit_amount: event.price,
                    },
                    quantity: 1,
                },
            ],
            shipping_address_collection: {
                allowed_countries: ['FR'],
            },
            success_url: confUrl,
            cancel_url: rejUrl,
        });
        rep.code(201).send(session);
    }
    catch (e) {
        console.error("Stripe error:", e.message);
        console.error("Stack trace:", e.stack);
        rep.code(500).send({ error: e.message });
    }
}
exports.orderEvent = orderEvent;
