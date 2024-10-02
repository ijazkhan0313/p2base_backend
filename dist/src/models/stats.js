"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventStatSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.eventStatSchema = new mongoose_1.default.Schema({
    webVisits: [{ date: { type: Date, required: true } }],
    appVisits: [{ date: { type: Date, required: true } }],
    uniqAppVisits: [{ date: { type: Date, required: true }, mobileIp: { type: String, required: true } }],
    appDownloads: [{ date: { type: Date, required: true } }],
    eventCreation: [{ identifier: { type: String, required: true },
            date: { type: Date, required: true } }],
    advertiserCreation: [{ identifier: { type: String, required: true },
            date: { type: Date, required: true } }],
    diffuserCreation: [{ identifier: { type: String, required: true },
            date: { type: Date, required: true } }],
    mobileUserCreation: [{ identifier: { type: String, required: true },
            date: { type: Date, required: true } }],
});
const EventStats = mongoose_1.default.model('EventStats', exports.eventStatSchema);
exports.default = EventStats;
