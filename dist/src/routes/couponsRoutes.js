"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const coupons_controller_1 = require("../controllers/coupons.controller");
const router = (0, fastify_1.default)();
async function couponsRoutes(router) {
    router.get('/p2base/admin/coupons', coupons_controller_1.getAllCoupons);
    router.get('/p2base/admin/coupon/:id', coupons_controller_1.getCouponDetails);
    router.post('/p2base/admin/add-coupon', coupons_controller_1.createCoupon);
    router.put('/p2base/admin/coupon/:id', coupons_controller_1.updateCoupon);
    router.delete('/p2base/admin/coupon/:id', coupons_controller_1.deleteCoupon);
}
module.exports = couponsRoutes;
