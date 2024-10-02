"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.p2bAds = exports.p2bEventFree = exports.sortingArray = void 0;
const node_path_1 = __importDefault(require("node:path"));
const geolocation_utils_1 = require("geolocation-utils");
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const now = (0, moment_1.default)().format("YYYY-MM-DD");
async function sortingArray(array) {
    array.sort(function (a, b) { return a.dist - b.dist; });
}
exports.sortingArray = sortingArray;
async function p2bEventFree(category, userDist, userLat, userLng, today) {
    let p2bEvents;
    if (today === true) {
        const filePath = node_path_1.default.join(__dirname, "..", "..", "..", 'data/todayP2bEvent.json');
        if (fs_1.default.existsSync(filePath)) {
            p2bEvents = JSON.parse(fs_1.default.readFileSync(filePath).toString());
        }
        else {
            return [];
        }
    }
    else {
        const filePath = node_path_1.default.join(__dirname, "..", "..", "..", 'data/p2bEvents.json');
        if (fs_1.default.existsSync(filePath)) {
            p2bEvents = JSON.parse(fs_1.default.readFileSync(filePath).toString());
        }
        else {
            return [];
        }
    }
    const events = [];
    for await (const event of p2bEvents) {
        const eventLat = parseFloat(event.lat);
        const eventLng = parseFloat(event.lng);
        const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
        if (dist <= userDist) {
            const themesArray = event.themes;
            for (const theme of themesArray) {
                if (theme === category) {
                    events.push(event);
                }
            }
        }
    }
    return events;
}
exports.p2bEventFree = p2bEventFree;
async function p2bAds(array, category, userLat, userLng) {
    const now = (0, moment_1.default)().format("YYYY-MM-DD");
    let p2bEvents;
    try {
        p2bEvents = fs_1.default.existsSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/p2bAdsEvents.json')) ? JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/p2bAdsEvents.json')).toString()) : [];
    }
    catch (err) {
        console.error(err);
        p2bEvents = [];
    }
    console.log(p2bEvents);
    if (p2bEvents.length > 0) {
        for (let i = 0; i < p2bEvents.length; i++) {
            const startDiffEvent = (0, moment_1.default)(p2bEvents[i].startDiff, true).format("YYYY-MM-DD");
            const endDiffEvent = (0, moment_1.default)(p2bEvents[i].endDiff, true).format("YYYY-MM-DD");
            const displayValidity = (0, moment_1.default)(now, true).isBetween((0, moment_1.default)(startDiffEvent, true), (0, moment_1.default)(endDiffEvent, true));
            if (displayValidity === true || startDiffEvent === now) {
                const eventLat = parseFloat(p2bEvents[i].lat);
                const eventLng = parseFloat(p2bEvents[i].lng);
                const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                if (dist <= p2bEvents[i].areaDiff) {
                    p2bEvents[i].dist = dist;
                    console.log(p2bEvents[i]);
                    const themesArray = p2bEvents[i].themes;
                    for (const theme of themesArray) {
                        console.log(theme);
                        if (theme === category) {
                            let index = i * 3 + 2;
                            if (index < array.length) {
                                array.splice(index, 0, p2bEvents[i]); // Insérer l'événement publicitaire à l'index approprié
                            }
                            else {
                                array.push(p2bEvents[i]); // Ajouter l'événement publicitaire à la fin du tableau si nécessaire
                            }
                        }
                    }
                }
            }
        }
        return array;
    }
    else {
        return [];
    }
}
exports.p2bAds = p2bAds;
