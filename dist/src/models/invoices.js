"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.invoiceSchema = new mongoose_1.default.Schema({
    invoiceNbre: { type: String, required: true },
    userMail: { type: String, required: true },
    eventIdentifier: { type: String, required: true },
    amountOrderWT: { type: String, required: true },
    invoiceObject: { type: String, required: true },
    orderDate: { type: Date, required: true },
});
const invoices = mongoose_1.default.model('Invoices', exports.invoiceSchema);
exports.default = invoices;
