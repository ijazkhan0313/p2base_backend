"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaTokens = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.SchemaTokens = new mongoose_1.default.Schema({
    token: { type: String },
    userMail: { type: String },
    platform: { type: String },
    mobileCode: { type: Number }
});
const Tokens = mongoose_1.default.model('Token', exports.SchemaTokens);
exports.default = Tokens;
