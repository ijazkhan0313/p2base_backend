"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const settings_controller_1 = require("../controllers/settings.controller");
const router = (0, fastify_1.default)();
async function settingsRoutes(router) {
    router.get('/p2base/admin/getPrices', settings_controller_1.getPrices);
    router.post('/p2base/admin/setPrices', settings_controller_1.setPrices);
}
module.exports = settingsRoutes;
