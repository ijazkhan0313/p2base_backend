"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.eventSchema = new mongoose_1.default.Schema({
    identifier: { type: 'string', required: true },
    themes: { type: [String] },
    tags: { type: [String] },
    author: { type: String, required: true },
    isAds: { type: Boolean, default: false },
    banner: { type: Boolean, default: false },
    eventNameFr: { type: String, required: true },
    eventFile: { type: String, /*required: true,*/ default: '' },
    videoLink: { type: String, /*required: true,*/ default: '' },
    addresses: { type: [String], /*required: true,*/ },
    city: { type: String, /*required: true,*/ },
    zip: { type: String, /*required: true,*/ },
    lat: { type: String /*,required: true*/ },
    lng: { type: String /*,required: true*/ },
    startDate: { type: String /*,required: true*/ },
    endDate: { type: String /*,required: true*/ },
    creationDate: { type: String },
    descriptionFr: { type: String },
    descriptionEn: { type: String },
    conditionsFr: { type: String /*,required: true},*/ },
    conditionsEn: { type: String },
    web: { type: String },
    tels: { type: [String] },
    minPrice: { type: [String], },
    maxPrice: { type: [String], },
    startTime: { type: String /*,required: true*/ },
    endTime: { type: String /*,required: true*/ },
    likes: { type: Number, default: 0 },
    clickView: { type: Number, default: 0 },
    callClick: { type: Number, default: 0 },
    webClick: { type: Number, default: 0 },
    view: { type: Number, default: 0 },
    share: { type: Number, default: 0 },
    active: { type: Boolean, required: true, default: false },
    pending: { type: Boolean, required: true, default: true },
    startDiff: { type: String, default: "" },
    endDiff: { type: String, default: "" },
    areaDiff: { type: String, default: "" },
    datesDiff: { type: [String], default: [] }
});
const Events = mongoose_1.default.model('Events', exports.eventSchema);
exports.default = Events;
