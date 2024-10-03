"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaAdminSettings = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.schemaAdminSettings = new mongoose_1.default.Schema({
    basePrice: { type: String, default: "" },
    dailyBannerPrice: { type: String, default: "" },
    monthPrice: { type: String, default: "" },
    annualPrice: { type: String, default: "" },
    moreCategory: { type: Number, default: 0 },
    option100: { type: Number, default: 0 },
    option200: { type: Number, default: 0 },
    optionFrance: { type: Number, default: 0 },
    dailyPrice: { type: String, default: "" },
});
const settings = mongoose_1.default.model('AdminSettings', exports.schemaAdminSettings);
exports.default = settings;
