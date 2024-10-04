"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPrices = exports.getPrices = void 0;
const adminSettings_1 = __importDefault(require("../models/adminSettings"));
async function getPrices(req, rep) {
    try {
        const priceSettings = await adminSettings_1.default.find({});
        return rep.code(200).send(priceSettings);
    }
    catch (error) {
        console.error(error);
    }
}
exports.getPrices = getPrices;
async function setPrices(req, rep) {
    await adminSettings_1.default.remove();
    const priceSettings = req.body;
    const newPrices = await adminSettings_1.default.create({
        basePrice: priceSettings.basePrice,
        dailyBannerPrice: priceSettings.dailyBannerPrice,
        monthPrice: priceSettings.monthPrice,
        annualPrice: priceSettings.annualPrice,
        moreCategory: priceSettings.moreCategory,
        option100: priceSettings.option100,
        option200: priceSettings.option200,
        optionFrance: priceSettings.optionFrance,
        dailyPrice: priceSettings.dailyPrice,
    });
    rep.code(201).send(newPrices);
}
exports.setPrices = setPrices;
