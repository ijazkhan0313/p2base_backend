"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webCall = exports.mobileLogin = exports.webSiteVisite = exports.saveDownloads = exports.getStats = void 0;
const stats_1 = __importDefault(require("../models/stats"));
const logsLib_1 = require("../utils/logsLib");
async function getStats(req, rep) {
    const stats = await stats_1.default.find({});
    rep.code(200).send(stats);
}
exports.getStats = getStats;
async function saveDownloads(req, rep) {
    (0, logsLib_1.logGlobalStats)("appDownloads");
    rep.code(201).send({ "message": "downloads update successfully" });
}
exports.saveDownloads = saveDownloads;
async function webSiteVisite(req, rep) {
    (0, logsLib_1.logGlobalStats)("visits");
    rep.code(201).send({ "message": "webVisitsLog update successfully" });
}
exports.webSiteVisite = webSiteVisite;
async function mobileLogin(req, rep) {
    const eventStatsDoc = await stats_1.default.findOne();
    const dateNow = new Date();
    if (!eventStatsDoc) {
        const newEventStatsDoc = new stats_1.default({
            visits: [],
            appVisit: [],
            appLogin: [{ date: dateNow }],
            appDownloads: [],
            eventCreation: [],
            advertiserCreation: [],
            diffuserCreation: [],
            mobileUserCreation: [],
        });
        await newEventStatsDoc.save();
    }
    else {
        // Si le document est trouvé, modifier la propriété eventCreation et sauvegarder le document
        const dateNow = new Date();
        const updatedappLogin = [...eventStatsDoc.appLogin, { date: dateNow }];
        eventStatsDoc.appLogin = updatedappLogin;
        await eventStatsDoc.save();
    }
    rep.code(201).send({ "message": "appLogin update successfully" });
}
exports.mobileLogin = mobileLogin;
async function webCall(req, res) {
    console.log("to call received");
}
exports.webCall = webCall;
