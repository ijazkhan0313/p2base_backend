"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCoupon = exports.updateCoupon = exports.createCoupon = exports.getCouponDetails = exports.getAllCoupons = void 0;
const coupon_1 = __importDefault(require("../models/coupon"));
async function getAllCoupons(req, rep) {
    try {
        const coupons = await coupon_1.default.find({});
        return rep.code(200).send(coupons);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getAllCoupons = getAllCoupons;
async function getCouponDetails(req, rep) {
    try {
        const couponId = req.params.id;
        const coupon = await coupon_1.default.find({ _id: couponId });
        rep.code(200).send(coupon);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getCouponDetails = getCouponDetails;
async function createCoupon(req, rep) {
    try {
        const coupon = req.body;
        const newCoupon = await coupon_1.default.create(coupon);
        rep.code(201).send(newCoupon);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.createCoupon = createCoupon;
async function updateCoupon(req, rep) {
    try {
        const couponId = req.params.id;
        const toUpdate = { ...req.body };
        const updateCoupon = await coupon_1.default.findOneAndUpdate({ _id: couponId }, toUpdate);
        rep.code(201).send(updateCoupon);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.updateCoupon = updateCoupon;
async function deleteCoupon(req, rep) {
    try {
        const couponId = req.params.id;
        await coupon_1.default.findByIdAndDelete({ _id: couponId });
        rep.code(200).send(`Coupon id: ${couponId} supprimé avec succès`);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.deleteCoupon = deleteCoupon;
