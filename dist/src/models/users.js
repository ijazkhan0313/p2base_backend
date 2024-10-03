"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaUsers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.schemaUsers = new mongoose_1.default.Schema({
    validUser: { type: Boolean, default: false },
    advertiser: { type: Boolean, default: false },
    diffuser: { type: Boolean, default: false },
    superAdmin: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
    brandName: { type: String, default: "" },
    firstname: { type: String, maxlength: 20, default: "" },
    lastname: { type: String, maxlength: 20, default: "" },
    //profilePicture: { type: String, default:"profile-picture-placeholder.png"},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, trim: true, minlength: 6 },
    favoritesEvents: { type: [Object] },
    streetAddress: { type: String, default: "" },
    city: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    siret: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    webSite: { type: String, default: "" },
    platform: { type: String }
});
const Users = mongoose_1.default.model('Users', exports.schemaUsers);
exports.default = Users;
