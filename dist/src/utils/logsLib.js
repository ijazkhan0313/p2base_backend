"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniqueAppVisit = exports.logGlobalStats = void 0;
const stats_1 = __importDefault(require("../models/stats"));
async function logGlobalStats(str, eventId) {
    const eventStatsDoc = await stats_1.default.findOne();
    const dateNow = new Date();
    if (str === 'visits') {
        if (!eventStatsDoc) {
            const newEventStatsDoc = new stats_1.default({
                webVisits: [{ date: dateNow }],
                appVisits: [],
                uniqAppVisits: [],
                appLogin: [],
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
            eventStatsDoc.webVisits.push({ date: dateNow });
            await eventStatsDoc.save();
        }
    }
    if (str === 'appVisit') {
        if (!eventStatsDoc) {
            const newEventStatsDoc = new stats_1.default({
                webVisits: [],
                appVisits: [{ date: dateNow }],
                uniqAppVisits: [],
                appLogin: [],
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
            eventStatsDoc.appVisits.push({ date: dateNow });
            await eventStatsDoc.save();
        }
    }
    if (str === 'appLogin') {
        if (!eventStatsDoc) {
            const newEventStatsDoc = new stats_1.default({
                webVisits: [],
                appVisits: [],
                uniqAppVisits: [],
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
            eventStatsDoc.appLogin.push({ date: dateNow });
            await eventStatsDoc.save();
        }
    }
    if (str === 'appDownloads') {
        if (!eventStatsDoc) {
            const newEventStatsDoc = new stats_1.default({
                webVisits: [],
                appVisits: [],
                uniqAppVisits: [],
                appLogin: [],
                appDownloads: [{ date: dateNow }],
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
            eventStatsDoc.appDownloads.push({ date: dateNow });
            await eventStatsDoc.save();
        }
    }
    if (str === 'eventLog') {
        if (!eventStatsDoc) {
            const newEventStatsDoc = new stats_1.default({
                webVisits: [],
                appVisits: [],
                uniqAppVisits: [],
                appLogin: [],
                appDownloads: [],
                eventCreation: [{ identifier: eventId, date: dateNow }],
                advertiserCreation: [],
                diffuserCreation: [],
                mobileUserCreation: [],
            });
            await newEventStatsDoc.save();
        }
        else {
            // Si le document est trouvé, modifier la propriété eventCreation et sauvegarder le document
            const dateNow = new Date();
            eventStatsDoc.eventCreation.push({ identifier: eventId, date: dateNow });
            await eventStatsDoc.save();
        }
    }
    if (str === 'advLog') {
        if (!eventStatsDoc) {
            const newEventStatsDoc = new stats_1.default({
                webVisits: [],
                appVisits: [],
                uniqAppVisits: [],
                appLogin: [],
                appDownloads: [],
                eventCreation: [],
                advertiserCreation: [{ identifier: eventId, date: dateNow }],
                diffuserCreation: [],
                mobileUserCreation: [],
            });
            await newEventStatsDoc.save();
        }
        else {
            // Si le document est trouvé, modifier la propriété eventCreation et sauvegarder le document
            const dateNow = new Date();
            eventStatsDoc.advertiserCreation.push({ identifier: eventId, date: dateNow });
            await eventStatsDoc.save();
        }
    }
    if (str === 'difLog') {
        if (!eventStatsDoc) {
            const newEventStatsDoc = new stats_1.default({
                webVisits: [],
                appVisits: [],
                uniqAppVisits: [],
                appLogin: [],
                appDownloads: [],
                eventCreation: [],
                advertiserCreation: [],
                diffuserCreation: [{ identifier: eventId, date: dateNow }],
                mobileUserCreation: [],
            });
            await newEventStatsDoc.save();
        }
        else {
            // Si le document est trouvé, modifier la propriété eventCreation et sauvegarder le document
            const dateNow = new Date();
            eventStatsDoc.diffuserCreation.push({ identifier: eventId, date: dateNow });
            await eventStatsDoc.save();
        }
    }
    if (str === 'mobileLog') {
        if (!eventStatsDoc) {
            const newEventStatsDoc = new stats_1.default({
                webVisits: [],
                appVisits: [],
                uniqAppVisits: [],
                appLogin: [],
                appDownloads: [],
                eventCreation: [],
                advertiserCreation: [],
                diffuserCreation: [{ identifier: eventId, date: dateNow }],
                mobileUserCreation: [],
            });
            await newEventStatsDoc.save();
        }
        else {
            // Si le document est trouvé, modifier la propriété eventCreation et sauvegarder le document
            const dateNow = new Date();
            eventStatsDoc.mobileUserCreation.push({ identifier: eventId, date: dateNow });
            await eventStatsDoc.save();
        }
    }
}
exports.logGlobalStats = logGlobalStats;
async function uniqueAppVisit(userIp) {
    console.log(userIp);
    const eventStatsDoc = await stats_1.default.findOne();
    const dateNow = new Date();
    if (!eventStatsDoc) {
        const newEventStatsDoc = new stats_1.default({
            webVisits: [],
            appVisits: [],
            uniqAppVisits: [{ date: dateNow, mobileIp: userIp }],
            appLogin: [],
            appDownloads: [],
            eventCreation: [],
            advertiserCreation: [],
            diffuserCreation: [],
            mobileUserCreation: [],
        });
        await newEventStatsDoc.save();
    }
    else {
        try {
            const dateNow = new Date();
            eventStatsDoc.uniqAppVisits.push({ date: dateNow, mobileIp: userIp });
            await eventStatsDoc.save();
        }
        catch (error) {
            console.log(error);
        }
    }
}
exports.uniqueAppVisit = uniqueAppVisit;
