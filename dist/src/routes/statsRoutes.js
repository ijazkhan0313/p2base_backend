"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stats_controller_1 = require("../controllers/stats.controller");
async function statsRoutes(router) {
    router.get('/p2base/admin/stats', stats_controller_1.getStats);
    router.get('/p2base/webVisitLog', stats_controller_1.webSiteVisite);
}
module.exports = statsRoutes;
