"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleEvent = exports.getSearchEvents = exports.getCategory10Events = exports.getCategory9Events = exports.getCategory8Events = exports.getCategory7Events = exports.getCategory6Events = exports.getCategory5Events = exports.getCategory4Events = exports.getCategory3Events = exports.getCategory2Events = exports.getCategory1Events = exports.getSites = exports.getFavorits = exports.getFavoritesEventsAndGeoloc = exports.getBannerEvents = exports.getNewsEvents = void 0;
const events_1 = __importDefault(require("../models/events"));
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
moment_1.default.locale('fr');
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = __importDefault(require("../models/users"));
const geolocation_utils_1 = require("geolocation-utils");
const categoriesLib_1 = require("../utils/categoriesLib");
const node_path_1 = __importDefault(require("node:path"));
const now = (0, moment_1.default)().format("YYYY-MM-DD");
async function getNewsEvents(req, rep) {
    const userLat = parseFloat(req.params.userLat);
    const userLng = parseFloat(req.params.userLng);
    const result = req.query.result;
    const limit = req.query.limit;
    const startIndex = (result - 1) * limit;
    const endIndex = result * limit;
    const datatourismeNews = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/newEvents.json')).toString());
    const p2bEvents = fs_1.default.existsSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/todayP2bEvent.json')) ? JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/todayP2bEvent.json')).toString()) : [];
    const globalData = datatourismeNews.concat(p2bEvents);
    const newsEventsData = [];
    try {
        for await (var event of globalData) {
            const eventLat = parseFloat(event.lat);
            const eventLng = parseFloat(event.lng);
            const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
            if (dist <= 40) {
                event.dist = dist;
                if (!event.img)
                    event.img = "https://images.pexels.com/photos/1051077/pexels-photo-1051077.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                newsEventsData.push(event);
            }
        }
        const newsEvents = newsEventsData.filter((element, index, self) => index === self.findIndex((e) => (e.identifier === element.identifier)));
        await (0, categoriesLib_1.sortingArray)(newsEvents);
        const resultEvents = newsEvents.slice(startIndex, endIndex);
        return rep.code(200).send(resultEvents);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getNewsEvents = getNewsEvents;
async function getBannerEvents(req, rep) {
    const bannerEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/bannerEvents.json')).toString());
    rep.code(200).send(bannerEvents);
}
exports.getBannerEvents = getBannerEvents;
async function getFavoritesEventsAndGeoloc(req, rep) {
    const userLat = parseFloat(req.params.userLat);
    const userLng = parseFloat(req.params.userLng);
    const events = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/events.json')).toString());
    const sites = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/sites.json')).toString());
    const activities = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/activities.json')).toString());
    const products = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/products.json')).toString());
    const hiking = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/hiking.json')).toString());
    const allData = events.concat(sites, activities, hiking, products);
    const userRequestId = new mongoose_1.default.Types.ObjectId(req.params.id);
    const userData = await users_1.default.findOne({ _id: userRequestId });
    const favoriteArray = userData?.favoritesEvents;
    const favoritEventsArray = [];
    try {
        favoriteArray?.forEach(async (item) => {
            for (var dataItem of allData) {
                if (item === dataItem.identifier) {
                    const eventLat = parseFloat(dataItem.lat);
                    const eventLng = parseFloat(dataItem.lng);
                    const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                    dataItem.dist = dist;
                    if (!dataItem.img)
                        dataItem.img = "https://images.pexels.com/photos/7557532/pexels-photo-7557532.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                    favoritEventsArray.push(dataItem);
                }
            }
        });
        rep.code(200).send(favoritEventsArray);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getFavoritesEventsAndGeoloc = getFavoritesEventsAndGeoloc;
async function getFavorits(req, rep) {
    // let userAllowed = req.body.superAdmin; 
    const events = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/events.json')).toString());
    const sites = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/sites.json')).toString());
    const activities = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/activities.json')).toString());
    const products = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/products.json')).toString());
    const hiking = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/hiking.json')).toString());
    const allData = events.concat(sites, activities, hiking, products);
    const userRequestId = new mongoose_1.default.Types.ObjectId(req.params.id);
    const userData = await users_1.default.findOne({ _id: userRequestId });
    const favoriteArray = userData?.favoritesEvents;
    const favoritEvents = [];
    try {
        favoriteArray?.forEach(async (item) => {
            for (var dataItem of allData) {
                if (item === dataItem.identifier) {
                    if (!dataItem.img)
                        dataItem.img = "https://images.pexels.com/photos/7557532/pexels-photo-7557532.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                    favoritEvents.push(dataItem);
                }
            }
        });
        const favoritFilterEvents = favoritEvents.filter((element, index, self) => index === self.findIndex((e) => (e.identifier === element.identifier)));
        rep.code(200).send(favoritFilterEvents);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getFavorits = getFavorits;
async function getSites(req, rep) {
    try {
        const result = req.query.result;
        const limit = req.query.limit;
        const startIndex = (result - 1) * limit;
        const endIndex = result * limit;
        const userLat = parseFloat(req.params.userLat);
        const userLng = parseFloat(req.params.userLng);
        const userDist = req.params.userDist;
        const sites = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/sites.json')).toString());
        const products = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/products.json')).toString());
        const activities = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/activities.json')).toString());
        const productsVisits = [];
        const activitiesThemes = [];
        for (var visit of products) {
            if (visit.themes.includes("Visit")) {
                productsVisits.push(visit);
            }
        }
        for (var activity of activities) {
            if (activity.themes.includes("TouristTrain") ||
                activity.themes.includes("TouristBus") ||
                activity.themes.includes("TourismCableCar") ||
                activity.themes.includes("RiverPort") ||
                activity.themes.includes("MooringArea") ||
                activity.themes.includes("VivariumAquarium") ||
                activity.themes.includes("SightseeingBoat")) {
                activitiesThemes.push(activity);
            }
        }
        const globalData = sites.concat(productsVisits);
        const sitesResults = [];
        for await (var event of globalData) {
            const eventLat = parseFloat(event.lat);
            const eventLng = parseFloat(event.lng);
            const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
            if (dist <= userDist) {
                event.dist = dist;
                if (!event.img)
                    event.img = "https://images.pexels.com/photos/3290386/pexels-photo-3290386.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                sitesResults.push(event);
            }
        }
        const sitesEvents = sitesResults.filter((element, index, self) => index === self.findIndex((e) => (e.identifier === element.identifier)));
        await (0, categoriesLib_1.sortingArray)(sitesEvents);
        const resultEvents = sitesEvents.slice(startIndex, endIndex);
        return rep.code(200).send(resultEvents);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getSites = getSites;
// Vide Greniers & Brocantes
async function getCategory1Events(req, rep) {
    try {
        const userLat = parseFloat(req.params.userLat);
        const userLng = parseFloat(req.params.userLng);
        const dateEndSet = req.query.dateEnd;
        const userDist = req.params.userDist;
        const result = req.query.result;
        const limit = req.query.limit;
        const startIndex = (result - 1) * limit;
        const endIndex = result * limit;
        let dataTourismeEvents;
        let p2bEvents;
        if (dateEndSet !== "null") {
            dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/categorie1.json')).toString());
        }
        else {
            dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/todayCategory1.json')).toString());
        }
        if (dateEndSet !== "null") {
            p2bEvents = await (0, categoriesLib_1.p2bEventFree)('Brocante', userDist, userLat, userLng);
        }
        else {
            p2bEvents = await (0, categoriesLib_1.p2bEventFree)('Brocante', userDist, userLat, userLng, true);
        }
        const events = dataTourismeEvents.concat(p2bEvents);
        const category1EventsData = [];
        for await (var event of events) {
            const startDateEvent = (0, moment_1.default)(event.startDate, true).format("YYYY-MM-DD");
            const endDateEvent = (0, moment_1.default)(event.endDate, true).format("YYYY-MM-DD");
            if (dateEndSet !== "null") {
                if ((0, moment_1.default)(now, true).isBetween((0, moment_1.default)(startDateEvent, true), (0, moment_1.default)(endDateEvent, true)) === true || now === startDateEvent && now === endDateEvent) {
                    const eventLat = parseFloat(event.lat);
                    const eventLng = parseFloat(event.lng);
                    const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                    if (dist <= userDist) {
                        event.dist = dist;
                        if (!event.img)
                            event.img = "https://images.pexels.com/photos/179959/pexels-photo-179959.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                        category1EventsData.push(event);
                    }
                }
            }
            else {
                const eventLat = parseFloat(event.lat);
                const eventLng = parseFloat(event.lng);
                const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                if (dist <= userDist) {
                    event.dist = dist;
                    if (!event.img)
                        event.img = "https://images.pexels.com/photos/179959/pexels-photo-179959.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                    category1EventsData.push(event);
                }
            }
        }
        const category1Events = category1EventsData.filter((element, index, self) => index === self.findIndex((e) => (e.identifier === element.identifier)));
        await (0, categoriesLib_1.sortingArray)(category1Events);
        (0, categoriesLib_1.p2bAds)(category1Events, "Brocante", userLat, userLng);
        const resultEvents = category1Events.slice(startIndex, endIndex);
        return rep.code(200).send(resultEvents);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getCategory1Events = getCategory1Events;
//Famille
async function getCategory2Events(req, rep) {
    try {
        const userLat = parseFloat(req.params.userLat);
        const userLng = parseFloat(req.params.userLng);
        const userDist = req.params.userDist;
        const dateEndSet = req.query.dateEnd;
        const dateStartSetting = (0, moment_1.default)(req.query.dateStart, true).format("YYYY-MM-DD");
        const result = req.query.result;
        const limit = req.query.limit;
        const startIndex = (result - 1) * limit;
        const endIndex = result * limit;
        let dataTourismeEvents;
        let p2bEvents;
        if (dateEndSet !== undefined) {
            dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/categorie2.json')).toString());
        }
        else {
            dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/todayCategory2.json')).toString());
        }
        if (dateEndSet !== undefined) {
            p2bEvents = await (0, categoriesLib_1.p2bEventFree)('Famille', userDist, userLat, userLng);
        }
        else {
            p2bEvents = await (0, categoriesLib_1.p2bEventFree)('Famille', userDist, userLat, userLng, true);
        }
        const events = dataTourismeEvents.concat(p2bEvents);
        const category2EventsData = [];
        for await (var event of events) {
            const startDateEvent = (0, moment_1.default)(event.startDate, true).format("YYYY-MM-DD");
            const endDateEvent = (0, moment_1.default)(event.endDate, true).format("YYYY-MM-DD");
            if (dateEndSet !== undefined) {
                if ((0, moment_1.default)(dateStartSetting, true).isSameOrAfter((0, moment_1.default)(startDateEvent, true)) && (0, moment_1.default)(dateStartSetting, true).isSameOrBefore(endDateEvent) == true) {
                    const eventLat = parseFloat(event.lat);
                    const eventLng = parseFloat(event.lng);
                    const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                    if (dist <= userDist) {
                        event.dist = dist;
                        if (!event.img)
                            event.img = "https://images.pexels.com/photos/5922291/pexels-photo-5922291.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                        category2EventsData.push(event);
                    }
                }
            }
            else {
                const eventLat = parseFloat(event.lat);
                const eventLng = parseFloat(event.lng);
                const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                if (dist <= userDist) {
                    event.dist = dist;
                    if (!event.img)
                        event.img = "https://images.pexels.com/photos/5922291/pexels-photo-5922291.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                    category2EventsData.push(event);
                }
            }
        }
        const category2Events = category2EventsData.filter((element, index, self) => index === self.findIndex((e) => (e.identifier === element.identifier)));
        (0, categoriesLib_1.sortingArray)(category2Events);
        (0, categoriesLib_1.p2bAds)(category2Events, "Famille", userLat, userLng);
        const resultEvents = category2Events.slice(startIndex, endIndex);
        return rep.code(200).send(resultEvents);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getCategory2Events = getCategory2Events;
//Expositions
async function getCategory3Events(req, rep) {
    try {
        const userLat = parseFloat(req.params.userLat);
        const userLng = parseFloat(req.params.userLng);
        const userDist = req.params.userDist;
        const dateStartSetting = (0, moment_1.default)(req.query.dateStart, true).format("YYYY-MM-DD");
        const dateEndSet = req.query.dateEnd;
        const result = req.query.result;
        const limit = req.query.limit;
        const startIndex = (result - 1) * limit;
        const endIndex = result * limit;
        let dataTourismeEvents;
        let p2bEvents;
        if (dateEndSet !== undefined) {
            dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/categorie3.json')).toString());
        }
        else {
            dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/todayCategory3.json')).toString());
        }
        if (dateEndSet !== undefined) {
            p2bEvents = await (0, categoriesLib_1.p2bEventFree)('Expositions', userDist, userLat, userLng);
        }
        else {
            p2bEvents = await (0, categoriesLib_1.p2bEventFree)('Expositions', userDist, userLat, userLng, true);
        }
        const events = dataTourismeEvents.concat(p2bEvents);
        const category3EventsData = [];
        for await (var event of events) {
            const startDateEvent = (0, moment_1.default)(event.startDate, true).format("YYYY-MM-DD");
            const endDateEvent = (0, moment_1.default)(event.endDate, true).format("YYYY-MM-DD");
            if (dateEndSet !== undefined) {
                if ((0, moment_1.default)(dateStartSetting, true).isSameOrAfter((0, moment_1.default)(startDateEvent, true)) && (0, moment_1.default)(dateStartSetting, true).isSameOrBefore(endDateEvent) == true) {
                    const eventLat = parseFloat(event.lat);
                    const eventLng = parseFloat(event.lng);
                    const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                    if (dist <= userDist) {
                        event.dist = dist;
                        if (!event.img)
                            event.img = "https://images.pexels.com/photos/2372979/pexels-photo-2372979.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                        category3EventsData.push(event);
                    }
                }
            }
            else {
                const eventLat = parseFloat(event.lat);
                const eventLng = parseFloat(event.lng);
                const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                if (dist <= userDist) {
                    event.dist = dist;
                    if (!event.img)
                        event.img = "https://images.pexels.com/photos/2372979/pexels-photo-2372979.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                    category3EventsData.push(event);
                }
            }
        }
        const category3Events = category3EventsData.filter((element, index, self) => index === self.findIndex((e) => (e.identifier === element.identifier)));
        await (0, categoriesLib_1.sortingArray)(category3Events);
        (0, categoriesLib_1.p2bAds)(category3Events, "Expositions", userLat, userLng);
        const resultEvents = category3Events.slice(startIndex, endIndex);
        return rep.code(200).send(resultEvents);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getCategory3Events = getCategory3Events;
//Spectacles concerts bals
async function getCategory4Events(req, rep) {
    try {
        const userLat = parseFloat(req.params.userLat);
        const userLng = parseFloat(req.params.userLng);
        const userDist = req.params.userDist;
        const dateStartSetting = (0, moment_1.default)(req.query.dateStart).format("YYYY-MM-DD");
        const dateEndSet = req.query.dateEnd;
        const result = req.query.result;
        const limit = req.query.limit;
        const startIndex = (result - 1) * limit;
        const endIndex = result * limit;
        let dataTourismeEvents;
        let p2bEvents;
        if (dateEndSet !== undefined) {
            dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/categorie4.json')).toString());
        }
        else {
            dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/todayCategory4.json')).toString());
        }
        if (dateEndSet !== undefined) {
            p2bEvents = await (0, categoriesLib_1.p2bEventFree)('Spectacles', userDist, userLat, userLng);
        }
        else {
            p2bEvents = await (0, categoriesLib_1.p2bEventFree)('Spectacles', userDist, userLat, userLng, true);
        }
        const events = dataTourismeEvents.concat(p2bEvents);
        const category4EventsData = [];
        for await (var event of events) {
            const startDateEvent = (0, moment_1.default)(event.startDate).format("YYYY-MM-DD");
            const endDateEvent = (0, moment_1.default)(event.endDate).format("YYYY-MM-DD");
            if (dateEndSet !== undefined) {
                if ((0, moment_1.default)(dateStartSetting, true).isSameOrAfter((0, moment_1.default)(startDateEvent, true)) && (0, moment_1.default)(dateStartSetting, true).isSameOrBefore(endDateEvent) == true) {
                    const eventLat = parseFloat(event.lat);
                    const eventLng = parseFloat(event.lng);
                    const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                    if (dist <= userDist) {
                        event.dist = dist;
                        if (!event.img)
                            event.img = "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                        category4EventsData.push(event);
                    }
                }
            }
            else {
                const eventLat = parseFloat(event.lat);
                const eventLng = parseFloat(event.lng);
                const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                if (dist <= userDist) {
                    event.dist = dist;
                    if (!event.img)
                        event.img = "https://images.pexels.com/photos/995301/pexels-photo-995301.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                    category4EventsData.push(event);
                }
            }
        }
        const category4Events = category4EventsData.filter((element, index, self) => index === self.findIndex((e) => (e.identifier === element.identifier)));
        await (0, categoriesLib_1.sortingArray)(category4Events);
        (0, categoriesLib_1.p2bAds)(category4Events, "Spectacles", userLat, userLng);
        const resultEvents = category4Events.slice(startIndex, endIndex);
        return rep.code(200).send(resultEvents);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getCategory4Events = getCategory4Events;
//Sports - Loisirs
async function getCategory5Events(req, rep) {
    try {
        const userLat = parseFloat(req.params.userLat);
        const userLng = parseFloat(req.params.userLng);
        const userDist = req.params.userDist;
        const dateStartSetting = (0, moment_1.default)(req.query.dateStart).format("YYYY-MM-DD");
        const dateEndSet = req.query.dateEnd;
        const result = req.query.result;
        const limit = req.query.limit;
        const startIndex = (result - 1) * limit;
        const endIndex = result * limit;
        let dataTourismeEvents;
        let p2bEvents;
        if (dateEndSet !== undefined) {
            dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/categorie5.json')).toString());
        }
        else {
            dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/todayCategory5.json')).toString());
        }
        if (dateEndSet !== undefined) {
            p2bEvents = await (0, categoriesLib_1.p2bEventFree)('Sports', userDist, userLat, userLng);
        }
        else {
            p2bEvents = await (0, categoriesLib_1.p2bEventFree)('Sports', userDist, userLat, userLng, true);
        }
        const events = dataTourismeEvents.concat(p2bEvents);
        const category5EventsData = [];
        for await (var event of events) {
            const startDateEvent = (0, moment_1.default)(event.startDate).format("YYYY-MM-DD");
            const endDateEvent = (0, moment_1.default)(event.endDate).format("YYYY-MM-DD");
            if (dateEndSet !== undefined) {
                if ((0, moment_1.default)(dateStartSetting, true).isSameOrAfter((0, moment_1.default)(startDateEvent, true)) && (0, moment_1.default)(dateStartSetting, true).isSameOrBefore(endDateEvent) == true) {
                    const eventLat = parseFloat(event.lat);
                    const eventLng = parseFloat(event.lng);
                    const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                    if (dist <= userDist) {
                        event.dist = dist;
                        if (!event.img)
                            event.img = "https://images.pexels.com/photos/1040427/pexels-photo-1040427.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                        category5EventsData.push(event);
                    }
                }
            }
            else {
                const eventLat = parseFloat(event.lat);
                const eventLng = parseFloat(event.lng);
                const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                if (dist <= userDist) {
                    event.dist = dist;
                    if (!event.img)
                        event.img = "https://images.pexels.com/photos/1040427/pexels-photo-1040427.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                    category5EventsData.push(event);
                }
            }
        }
        const category5Events = category5EventsData.filter((element, index, self) => index === self.findIndex((e) => (e.identifier === element.identifier)));
        await (0, categoriesLib_1.sortingArray)(category5Events);
        (0, categoriesLib_1.p2bAds)(category5Events, "Sports", userLat, userLng);
        const resultEvents = category5Events.slice(startIndex, endIndex);
        return rep.code(200).send(resultEvents);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getCategory5Events = getCategory5Events;
//Évènements culturels
async function getCategory6Events(req, rep) {
    try {
        const userLat = parseFloat(req.params.userLat);
        const userLng = parseFloat(req.params.userLng);
        const userDist = req.params.userDist;
        const dateStartSetting = (0, moment_1.default)(req.query.dateStart).format("YYYY-MM-DD");
        const dateEndSet = req.query.dateEnd;
        const result = req.query.result;
        const limit = req.query.limit;
        const startIndex = (result - 1) * limit;
        const endIndex = result * limit;
        let dataTourismeEvents;
        let p2bEvents;
        if (dateEndSet !== undefined) {
            dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/categorie6.json')).toString());
        }
        else {
            dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/todayCategory6.json')).toString());
        }
        if (dateEndSet !== undefined) {
            p2bEvents = await (0, categoriesLib_1.p2bEventFree)('Culturels', userDist, userLat, userLng);
        }
        else {
            p2bEvents = await (0, categoriesLib_1.p2bEventFree)('Culturels', userDist, userLat, userLng, true);
        }
        const events = dataTourismeEvents.concat(p2bEvents);
        const category6EventsData = [];
        for await (var event of events) {
            const startDateEvent = (0, moment_1.default)(event.startDate).format("YYYY-MM-DD");
            const endDateEvent = (0, moment_1.default)(event.endDate).format("YYYY-MM-DD");
            if (dateEndSet !== undefined) {
                if ((0, moment_1.default)(dateStartSetting, true).isSameOrAfter((0, moment_1.default)(startDateEvent, true)) && (0, moment_1.default)(dateStartSetting, true).isSameOrBefore(endDateEvent) == true) {
                    const eventLat = parseFloat(event.lat);
                    const eventLng = parseFloat(event.lng);
                    const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                    if (dist <= userDist) {
                        event.dist = dist;
                        if (!event.img) {
                            event.img = "https://images.pexels.com/photos/2728252/pexels-photo-2728252.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                        }
                        category6EventsData.push(event);
                    }
                }
            }
            else {
                const eventLat = parseFloat(event.lat);
                const eventLng = parseFloat(event.lng);
                const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                if (dist <= userDist) {
                    event.dist = dist;
                    if (!event.img) {
                        event.img = "https://images.pexels.com/photos/2728252/pexels-photo-2728252.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                    }
                    category6EventsData.push(event);
                }
            }
        }
        const category6Events = category6EventsData.filter((element, index, self) => index === self.findIndex((e) => (e.identifier === element.identifier)));
        await (0, categoriesLib_1.sortingArray)(category6Events);
        (0, categoriesLib_1.p2bAds)(category6Events, "Culturels", userLat, userLng);
        const resultEvents = category6Events.slice(startIndex, endIndex);
        return rep.code(200).send(resultEvents);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getCategory6Events = getCategory6Events;
//Visites guidées & Théatres
async function getCategory7Events(req, rep) {
    try {
        const userLat = parseFloat(req.params.userLat);
        const userLng = parseFloat(req.params.userLng);
        const userDist = req.params.userDist;
        const dateStartSetting = (0, moment_1.default)(req.query.dateStart).format("YYYY-MM-DD");
        const dateEndSet = req.query.dateEnd;
        const result = req.query.result;
        const limit = req.query.limit;
        const startIndex = (result - 1) * limit;
        const endIndex = result * limit;
        let dataTourismeEvents;
        let p2bEvents;
        if (dateEndSet !== undefined) {
            dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/categorie7.json')).toString());
        }
        else {
            dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/todayCategory7.json')).toString());
        }
        if (dateEndSet !== undefined) {
            p2bEvents = await (0, categoriesLib_1.p2bEventFree)('Visites', userDist, userLat, userLng);
        }
        else {
            p2bEvents = await (0, categoriesLib_1.p2bEventFree)('Visites', userDist, userLat, userLng, true);
        }
        const events = dataTourismeEvents.concat(p2bEvents);
        const category7EventsData = [];
        for await (var event of events) {
            const startDateEvent = (0, moment_1.default)(event.startDate).format("YYYY-MM-DD");
            const endDateEvent = (0, moment_1.default)(event.endDate).format("YYYY-MM-DD");
            if (dateEndSet !== undefined) {
                if ((0, moment_1.default)(dateStartSetting, true).isSameOrAfter((0, moment_1.default)(startDateEvent, true)) && (0, moment_1.default)(dateStartSetting).isSameOrBefore(endDateEvent) == true) {
                    const eventLat = parseFloat(event.lat);
                    const eventLng = parseFloat(event.lng);
                    const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                    if (dist <= userDist) {
                        event.dist = dist;
                        if (!event.img)
                            event.img = "https://images.pexels.com/photos/4345859/pexels-photo-4345859.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                        category7EventsData.push(event);
                    }
                }
            }
            else {
                const eventLat = parseFloat(event.lat);
                const eventLng = parseFloat(event.lng);
                const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                if (dist <= userDist) {
                    event.dist = dist;
                    if (!event.img)
                        event.img = "https://images.pexels.com/photos/4345859/pexels-photo-4345859.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                    category7EventsData.push(event);
                }
            }
        }
        const category7Events = category7EventsData.filter((element, index, self) => index === self.findIndex((e) => (e.identifier === element.identifier)));
        await (0, categoriesLib_1.sortingArray)(category7Events);
        (0, categoriesLib_1.p2bAds)(category7Events, "Salons", userLat, userLng);
        const resultEvents = category7Events.slice(startIndex, endIndex);
        return rep.code(200).send(resultEvents);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getCategory7Events = getCategory7Events;
//Fêtes - Marchés - autres
async function getCategory8Events(req, rep) {
    try {
        const userLat = parseFloat(req.params.userLat);
        const userLng = parseFloat(req.params.userLng);
        const userDist = req.params.userDist;
        const dateStartSetting = (0, moment_1.default)(req.query.dateStart).format("YYYY-MM-DD");
        const dateEndSet = req.query.dateEnd;
        const result = req.query.result;
        const limit = req.query.limit;
        const startIndex = (result - 1) * limit;
        const endIndex = result * limit;
        let dataTourismeEvents;
        let p2bEvents;
        if (dateEndSet !== undefined) {
            dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/categorie8.json')).toString());
        }
        else {
            dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/todayCategory8.json')).toString());
        }
        if (dateEndSet !== undefined) {
            p2bEvents = await (0, categoriesLib_1.p2bEventFree)('Marchés', userDist, userLat, userLng);
        }
        else {
            p2bEvents = await (0, categoriesLib_1.p2bEventFree)('Marchés', userDist, userLat, userLng, true);
        }
        const events = dataTourismeEvents.concat(p2bEvents);
        const category8EventsData = [];
        for await (var event of events) {
            const startDateEvent = (0, moment_1.default)(event.startDate, true).format("YYYY-MM-DD");
            const endDateEvent = (0, moment_1.default)(event.endDate, true).format("YYYY-MM-DD");
            if (dateEndSet !== undefined) {
                if ((0, moment_1.default)(dateStartSetting, true).isSameOrAfter((0, moment_1.default)(startDateEvent, true)) && (0, moment_1.default)(dateStartSetting, true).isSameOrBefore(endDateEvent) == true) {
                    const eventLat = parseFloat(event.lat);
                    const eventLng = parseFloat(event.lng);
                    const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                    if (dist <= userDist) {
                        event.dist = dist;
                        if (!event.img)
                            event.img = "https://images.pexels.com/photos/2345976/pexels-photo-2345976.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                        category8EventsData.push(event);
                    }
                }
            }
            else {
                const eventLat = parseFloat(event.lat);
                const eventLng = parseFloat(event.lng);
                const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                if (dist <= userDist) {
                    event.dist = dist;
                    if (!event.img)
                        event.img = "https://images.pexels.com/photos/2345976/pexels-photo-2345976.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                    category8EventsData.push(event);
                }
            }
        }
        const category8Events = category8EventsData.filter((element, index, self) => index === self.findIndex((e) => (e.identifier === element.identifier)));
        await (0, categoriesLib_1.sortingArray)(category8Events);
        (0, categoriesLib_1.p2bAds)(category8Events, "Marchés", userLat, userLng);
        const resultEvents = category8Events.slice(startIndex, endIndex);
        return rep.code(200).send(resultEvents);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getCategory8Events = getCategory8Events;
//Itineraires tourisitques
async function getCategory9Events(req, rep) {
    try {
        const userLat = parseFloat(req.params.userLat);
        const userLng = parseFloat(req.params.userLng);
        const userDist = req.params.userDist;
        const result = req.query.result;
        const limit = req.query.limit;
        const startIndex = (result - 1) * limit;
        const endIndex = result * limit;
        const dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/categorie9.json')).toString());
        const p2bEvents = await (0, categoriesLib_1.p2bEventFree)('Itinéraires', userDist, userLat, userLng);
        const events = dataTourismeEvents.concat(p2bEvents);
        const category9EventsData = [];
        for await (var event of events) {
            const eventLat = parseFloat(event.lat);
            const eventLng = parseFloat(event.lng);
            const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
            if (dist <= userDist) {
                event.dist = dist;
                if (!event.img)
                    event.img = "https://images.pexels.com/photos/5370916/pexels-photo-5370916.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                category9EventsData.push(event);
            }
        }
        const category9Events = category9EventsData.filter((element, index, self) => index === self.findIndex((e) => (e.identifier === element.identifier)));
        await (0, categoriesLib_1.sortingArray)(category9Events);
        (0, categoriesLib_1.p2bAds)(category9Events, "Itinéraires", userLat, userLng);
        const resultEvents = category9Events.slice(startIndex, endIndex);
        return rep.code(200).send(resultEvents);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getCategory9Events = getCategory9Events;
//Commémorations
async function getCategory10Events(req, rep) {
    try {
        const userLat = parseFloat(req.params.userLat);
        const userLng = parseFloat(req.params.userLng);
        const userDist = req.params.userDist;
        const dateStartSetting = (0, moment_1.default)(req.query.dateStart).format("YYYY-MM-DD");
        const dateEndSet = req.query.dateEnd;
        const result = req.query.result;
        const limit = req.query.limit;
        const startIndex = (result - 1) * limit;
        const endIndex = result * limit;
        let dataTourismeEvents;
        let p2bEvents;
        console.log(dateEndSet);
        if (dateEndSet !== undefined) {
            dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/categorie10.json')).toString());
        }
        else {
            dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/todayCategory10.json')).toString());
        }
        if (dateEndSet !== undefined) {
            p2bEvents = await (0, categoriesLib_1.p2bEventFree)('Commémoration', userDist, userLat, userLng);
        }
        else {
            p2bEvents = await (0, categoriesLib_1.p2bEventFree)('Commémoration', userDist, userLat, userLng, true);
        }
        const events = dataTourismeEvents.concat(p2bEvents);
        const category10EventsData = [];
        for await (var event of events) {
            const startDateEvent = (0, moment_1.default)(event.startDate, true).format("YYYY-MM-DD");
            const endDateEvent = (0, moment_1.default)(event.endDate, true).format("YYYY-MM-DD");
            if (dateEndSet !== undefined) {
                if ((0, moment_1.default)(dateStartSetting, true).isSameOrAfter((0, moment_1.default)(startDateEvent, true)) && (0, moment_1.default)(dateStartSetting, true).isSameOrBefore(endDateEvent) == true) {
                    const eventLat = parseFloat(event.lat);
                    const eventLng = parseFloat(event.lng);
                    const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                    if (dist <= userDist) {
                        event.dist = dist;
                        if (!event.img)
                            event.img = "https://images.pexels.com/photos/2267348/pexels-photo-2267348.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                        category10EventsData.push(event);
                    }
                }
            }
            else {
                const eventLat = parseFloat(event.lat);
                const eventLng = parseFloat(event.lng);
                const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
                if (dist <= userDist) {
                    event.dist = dist;
                    if (!event.img)
                        event.img = "https://images.pexels.com/photos/2267348/pexels-photo-2267348.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                    category10EventsData.push(event);
                }
            }
        }
        const category10Events = category10EventsData.filter((element, index, self) => index === self.findIndex((e) => (e.identifier === element.identifier)));
        await (0, categoriesLib_1.sortingArray)(category10Events);
        (0, categoriesLib_1.p2bAds)(category10Events, "Commémoration", userLat, userLng);
        const resultEvents = category10Events.slice(startIndex, endIndex);
        return rep.code(200).send(resultEvents);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getCategory10Events = getCategory10Events;
async function getSearchEvents(req, rep) {
    try {
        const userLat = parseFloat(req.params.userLat);
        const userLng = parseFloat(req.params.userLng);
        const userDist = req.params.userDist;
        //const searchRequest = req.params.search;
        //const splitSearch = searchRequest.split('-');
        const dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/events.json')).toString());
        const hiking = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/hiking.json')).toString());
        const activities = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/activities.json')).toString());
        const sites = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/sites.json')).toString());
        const products = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/products.json')).toString());
        const swpEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/sowprogEvents.json')).toString());
        //const p2bEvents = JSON.parse(fs.readFileSync(path.join(__dirname,"..","..","..",'data/p2bEvents.json')).toString());
        //const dbEvents = await Events.find({})
        //const events = dataTourismeEvents.concat(sites,dbEvents,hiking,activities, products, swpEvents, p2bEvents);
        const events = dataTourismeEvents.concat(sites, hiking, activities, products, swpEvents);
        const searchEventsResults = [];
        for (const event of events) {
            const eventLat = parseFloat(event.lat);
            const eventLng = parseFloat(event.lng);
            const dist = (0, geolocation_utils_1.headingDistanceTo)({ lat: userLat, lon: userLng }, { lat: eventLat, lon: eventLng }).distance / 1000;
            event.dist = dist;
            if (!event.img)
                event.img = "https://images.pexels.com/photos/1194775/pexels-photo-1194775.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
            //const stringEvent =JSON.stringify(event);
            if (dist <= userDist) {
                searchEventsResults.push(event);
            }
        }
        await (0, categoriesLib_1.sortingArray)(searchEventsResults);
        console.log(searchEventsResults[2]);
        return rep.code(200).send(searchEventsResults);
    }
    catch (error) {
        console.log(error);
    }
}
exports.getSearchEvents = getSearchEvents;
async function getSingleEvent(req, rep) {
    try {
        const eventId = req.params.id;
        const dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/events.json')).toString());
        const hiking = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/hiking.json')).toString());
        const activities = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/activities.json')).toString());
        const sites = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/sites.json')).toString());
        const products = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/products.json')).toString());
        const swpEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/sowprogEvents.json')).toString());
        const p2bEvents = fs_1.default.existsSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/p2bEvent.json')) ? JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/p2bEvent.json')).toString()) : [];
        const p2bAdsEvents = fs_1.default.existsSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/p2bAdsEvents.json')) ? JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/p2bAdsEvents.json')).toString()) : [];
        const dbEvents = await events_1.default.find({});
        const events = dataTourismeEvents.concat(sites, dbEvents, hiking, activities, products, swpEvents, p2bEvents, p2bAdsEvents);
        const EventsResults = [];
        for (const event of events) {
            if (event.identifier === eventId) {
                EventsResults.push(event);
            }
        }
        await (0, categoriesLib_1.sortingArray)(EventsResults);
        return rep.code(200).send(EventsResults);
    }
    catch (error) {
        console.log(error);
    }
}
exports.getSingleEvent = getSingleEvent;
