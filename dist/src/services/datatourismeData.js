"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.theatreContempo = exports.sowprogEvents = exports.newsEvents = exports.activitiesToArray = exports.hikingToArray = exports.productsToArray = exports.SitesToArray = exports.EventsToArray = exports.getHiking = exports.getProducts = exports.getActivities = exports.getSites = exports.getEvents = exports.unZipData = void 0;
// Import Node.js Dependencies
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const adm_zip_1 = __importDefault(require("adm-zip"));
// Import Third-party Dependencies
const superagent_1 = __importDefault(require("superagent"));
const moment_1 = __importDefault(require("moment"));
//CONSTANTS
const KzipEvents = path_1.default.join(__dirname, '..', '..', '..', 'data/datatourisme_events.zip');
const KzipSites = path_1.default.join(__dirname, '..', '..', '..', 'data/datatourisme_sites.zip');
const KzipActivities = path_1.default.join(__dirname, '..', '..', '..', 'data/datatourisme_activities.zip');
const KzipHiking = path_1.default.join(__dirname, '..', '..', '..', 'data/datatourisme_hiking.zip');
const KzipProducts = path_1.default.join(__dirname, '..', '..', '..', 'data/datatourisme_products.zip');
const KdatatourismeEvents = path_1.default.join(__dirname, '..', '..', '..', 'data/datatourismeEvents');
const KdatatourismeActivities = path_1.default.join(__dirname, '..', '..', '..', 'data/datatourismeActivities');
const KdatatourimseHiking = path_1.default.join(__dirname, '..', '..', '..', 'data/datatourismeHiking');
const KdatatourismeProducts = path_1.default.join(__dirname, '..', '..', '..', 'data/datatourismeProducts');
const KdatatourismeSites = path_1.default.join(__dirname, '..', '..', '..', 'data/datatourismeSites');
const KeventsDir = path_1.default.join(__dirname, '..', '..', '..', 'data/datatourismeEvents/objects');
const KsitesDir = path_1.default.join(__dirname, '..', '..', '..', 'data/datatourismeSites/objects');
const KactivitiesDir = path_1.default.join(__dirname, '..', '..', '..', 'data/datatourismeActivities/objects');
const KproductsDir = path_1.default.join(__dirname, '..', '..', '..', 'data/datatourismeProducts/objects');
const KhikingDir = path_1.default.join(__dirname, '..', '..', '..', 'data/datatourismeHiking/objects');
const Kevents = "https://diffuseur.datatourisme.fr/webservice/4adb6f57cb42b6d6f4d91a94dcac5f8c/2f2f04cb-942c-4dac-bbeb-1b10363a6afd";
const Ksites = "https://diffuseur.datatourisme.fr/webservice/60dfc39f824f2c57777c8ad0bb99280c/2f2f04cb-942c-4dac-bbeb-1b10363a6afd";
const Kactivities = "https://diffuseur.datatourisme.fr/webservice/60aa696d6d346ed639f9e196459d27f9/2f2f04cb-942c-4dac-bbeb-1b10363a6afd";
const Kproducts = "https://diffuseur.datatourisme.fr/webservice/40b7f3d7d867d5c42791313dc9a8fd62/2f2f04cb-942c-4dac-bbeb-1b10363a6afd";
const Khiking = "https://diffuseur.datatourisme.fr/webservice/a35ed0ffd96359f1f24625eeab3a112e/2f2f04cb-942c-4dac-bbeb-1b10363a6afd";
async function unZipData(zipFile, directory) {
    const Kunzip = new adm_zip_1.default(zipFile);
    try {
        console.log('unzipping started');
        Kunzip.extractAllTo(directory);
        console.log('unzipping completed');
    }
    catch (err) {
        console.log(err);
    }
}
exports.unZipData = unZipData;
async function getEvents() {
    if (fs_1.default.existsSync(KzipEvents))
        fs_1.default.rmSync(KzipEvents, { recursive: true, force: true });
    if (fs_1.default.existsSync(KdatatourismeEvents))
        fs_1.default.rmSync(KdatatourismeEvents, { recursive: true, force: true });
    console.log(KdatatourismeEvents);
    console.log("Start downloading events zip");
    superagent_1.default.get(Kevents)
        .pipe(fs_1.default.createWriteStream(path_1.default.join(__dirname, '..', '..', '..', 'data/datatourisme_events.zip')))
        .on("error", (err) => console.log(err))
        .on("close", () => {
        console.log("events zip downloaded successfully");
        unZipData(KzipEvents, KdatatourismeEvents);
        EventsToArray();
        // Data to write on file
        let data = `${new Date().toUTCString()} 
              : Server is working\n`;
        // Appending data to logs.txt file
        fs_1.default.appendFile("logs.txt", data, function (err) {
            if (err)
                throw err;
            console.log("Évènements mise à jour avec succès!");
        });
    });
}
exports.getEvents = getEvents;
async function getSites() {
    if (fs_1.default.existsSync(KzipSites))
        fs_1.default.rmSync(KzipSites);
    if (fs_1.default.existsSync(KdatatourismeSites))
        fs_1.default.rmSync(KdatatourismeSites, { recursive: true, force: true });
    console.log("Start downloading sites zip");
    superagent_1.default.get(Ksites)
        .pipe(fs_1.default.createWriteStream(path_1.default.join(__dirname, '..', '..', '..', 'data/datatourisme_sites.zip')))
        .on("error", (err) => console.log(err))
        .on("close", () => {
        console.log("sites zip downloaded successfully");
        unZipData(KzipSites, KdatatourismeSites);
        SitesToArray();
        // Data to write on file
        let data = `${new Date().toUTCString()} 
              : Server is working\n`;
        // Appending data to logs.txt file
        fs_1.default.appendFile("logs.txt", data, function (err) {
            if (err)
                throw err;
            console.log("Sites mise à jour avec succès!");
        });
    });
}
exports.getSites = getSites;
async function getActivities() {
    if (fs_1.default.existsSync(KzipActivities))
        fs_1.default.rmSync(KzipActivities);
    if (fs_1.default.existsSync(KdatatourismeActivities))
        fs_1.default.rmSync(KdatatourismeActivities, { recursive: true, force: true });
    console.log("Start downloading activities zip");
    superagent_1.default.get(Kactivities)
        .pipe(fs_1.default.createWriteStream(path_1.default.join(__dirname, '..', '..', '..', 'data/datatourisme_activities.zip')))
        .on("error", (err) => console.log(err))
        .on("close", () => {
        console.log("activities zip downloaded successfully");
        unZipData(KzipActivities, KdatatourismeActivities);
        activitiesToArray();
        // Data to write on file
        let data = `${new Date().toUTCString()} 
                  : Server is working\n`;
        // Appending data to logs.txt file
        fs_1.default.appendFile("logs.txt", data, function (err) {
            if (err)
                throw err;
            console.log("Activities mise à jour avec succès!");
        });
    });
}
exports.getActivities = getActivities;
async function getProducts() {
    if (fs_1.default.existsSync(KzipProducts))
        fs_1.default.rmSync(KzipProducts);
    if (fs_1.default.existsSync(KdatatourismeProducts))
        fs_1.default.rmSync(KdatatourismeProducts, { recursive: true, force: true });
    console.log("Start downloading products zip");
    superagent_1.default.get(Kproducts)
        .pipe(fs_1.default.createWriteStream(path_1.default.join(__dirname, '..', '..', '..', 'data/datatourisme_products.zip')))
        .on("error", (err) => console.log(err))
        .on("close", () => {
        console.log("products zip downloaded successfully");
        unZipData(KzipProducts, KdatatourismeProducts);
        productsToArray();
        // Data to write on file
        let data = `${new Date().toUTCString()} 
              : Server is working\n`;
        // Appending data to logs.txt file
        fs_1.default.appendFile("logs.txt", data, function (err) {
            if (err)
                throw err;
            console.log("Products mise à jour avec succès!");
        });
    });
}
exports.getProducts = getProducts;
async function getHiking() {
    if (fs_1.default.existsSync(KzipHiking))
        fs_1.default.rmSync(KzipHiking);
    if (fs_1.default.existsSync(KdatatourimseHiking))
        fs_1.default.rmSync(KdatatourimseHiking, { recursive: true, force: true });
    console.log("Start downloading hiking zip");
    superagent_1.default.get(Khiking)
        .pipe(fs_1.default.createWriteStream(path_1.default.join(__dirname, '..', '..', '..', 'data/datatourisme_hiking.zip')))
        .on("error", (err) => console.log(err))
        .on("close", () => {
        console.log("hiking zip downloaded successfully");
        unZipData(KzipHiking, KdatatourimseHiking);
        hikingToArray();
        // Data to write on file
        let data = `${new Date().toUTCString()} 
                : Server is working\n`;
        // Appending data to logs.txt file
        fs_1.default.appendFile("logs.txt", data, function (err) {
            if (err)
                throw err;
            console.log("Hiking mise à jour avec succès!");
        });
    });
}
exports.getHiking = getHiking;
async function EventsToArray() {
    const dirs = [];
    const subDirs = [];
    const jsonEventsPaths = [];
    const eventsDataArray = [];
    const rootDir = fs_1.default.readdirSync(KeventsDir);
    //Get first dir paths level
    for await (const dir of rootDir) {
        if (!dir.endsWith('.DS_Store')) {
            dirs.push(path_1.default.join(path_1.default.join(__dirname, '..', '..', '..', `data/datatourismeEvents/objects/${dir}`)));
        }
    }
    //Second dir paths level
    for await (const dirPath of dirs) {
        const subDirPath = fs_1.default.readdirSync(dirPath);
        for await (const subdir of subDirPath) {
            if (!subdir.endsWith('.DS_Store')) {
                subDirs.push(path_1.default.join(`${dirPath}/${subdir}`));
            }
        }
    }
    // Create json path array
    for await (const subdirPath of subDirs) {
        const jsonPath = fs_1.default.readdirSync(subdirPath);
        for await (const jsonfilePath of jsonPath)
            jsonEventsPaths.push(path_1.default.join(`${subdirPath}/${jsonfilePath}`));
    }
    console.log('start creating events array');
    for await (const jsonEvent of jsonEventsPaths) {
        const eventLite = {
            identifier: '',
            themes: [],
            itemNameFr: '',
            creationDate: '',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            address: [],
            city: '',
            zip: '',
            lat: '',
            lng: '',
            schemaLogo: '',
            tel: [],
            web: '',
            img: '',
            descriptionFr: '',
            shortDescriptionFr: '',
            price: '',
            minPrice: '',
            maxPrice: '',
        };
        try {
            const jsonEventPath = JSON.parse(fs_1.default.readFileSync(jsonEvent, 'utf8'));
            eventLite.identifier = jsonEventPath["dc:identifier"] ? jsonEventPath["dc:identifier"] : jsonEventPath['rdfs:label']['fr'][0] + jsonEventPath['creationDate'];
            eventLite.themes = jsonEventPath['@type'];
            eventLite.itemNameFr = jsonEventPath['rdfs:label']['fr'][0];
            eventLite.creationDate = jsonEventPath['creationDate'];
            eventLite.startDate = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['startDate'] ? jsonEventPath['takesPlaceAt'][0]['startDate'] : null;
            eventLite.endDate = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['endDate'] ? jsonEventPath['takesPlaceAt'][0]['endDate'] : null;
            eventLite.startTime = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['startTime'] ? jsonEventPath['takesPlaceAt'][0]['startTime'] : null;
            eventLite.endTime = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['endTime'] ? jsonEventPath['takesPlaceAt'][0]['endTime'] : null;
            eventLite.address = jsonEventPath['isLocatedAt'][0]['schema:address'][0]['schema:streetAddress'];
            eventLite.city = jsonEventPath['isLocatedAt'][0]['schema:address'][0]['schema:addressLocality'].toString();
            eventLite.zip = jsonEventPath['isLocatedAt'][0]['schema:address'][0]['schema:postalCode'].toString();
            eventLite.lat = jsonEventPath['isLocatedAt'][0]['schema:geo']['schema:latitude'];
            eventLite.lng = jsonEventPath['isLocatedAt'][0]['schema:geo']['schema:longitude'];
            eventLite.schemaLogo = jsonEventPath['hasBeenPublishedBy'] && jsonEventPath['hasBeenPublishedBy'][0]['schema:logo'] ? jsonEventPath['hasBeenPublishedBy'][0]['schema:logo'] : null;
            eventLite.tel = jsonEventPath['hasContact'] && jsonEventPath['hasContact'][0]['schema:telephone'] ? jsonEventPath['hasContact'][0]['schema:telephone'] : null;
            eventLite.web = jsonEventPath['hasContact'] && jsonEventPath['hasContact'][0]["foaf:homepage"] ? jsonEventPath['hasContact'][0]["foaf:homepage"][0].toString() : null;
            eventLite.img = jsonEventPath["hasMainRepresentation"] && jsonEventPath["hasMainRepresentation"][0]['ebucore:hasRelatedResource'] ? eventLite.img = jsonEventPath["hasMainRepresentation"][0]['ebucore:hasRelatedResource'][0]['ebucore:locator'].toString() : null;
            eventLite.descriptionFr = jsonEventPath['hasDescription'] && jsonEventPath['hasDescription'][0]['dc:description'] && jsonEventPath['hasDescription'][0]['dc:description']['fr'] ? jsonEventPath['hasDescription'][0]['dc:description']['fr'][0].toString() : null;
            eventLite.shortDescriptionFr = jsonEventPath['hasDescription'] && jsonEventPath['hasDescription'][0]['shortDescription'] && jsonEventPath['hasDescription'][0]['shortDescription']['fr'] ? jsonEventPath['hasDescription'][0]['shortDescription']['fr'][0].toString() : null;
            eventLite.price = jsonEventPath['offers'] && jsonEventPath['offers'][0]['schema:priceSpecification'] ? jsonEventPath['offers'][0]['schema:priceSpecification'][0]['schema:price'] : null;
            eventLite.minPrice = jsonEventPath['offers'] && jsonEventPath['offers'][0]['schema:priceSpecification'] ? jsonEventPath['offers'][0]['schema:priceSpecification'][0]['schema:minPrice'] : null;
            eventLite.maxPrice = jsonEventPath['offers'] && jsonEventPath['offers'][0]['schema:priceSpecification'] ? jsonEventPath['offers'][0]['schema:priceSpecification'][0]['schema:maxPrice'] : null;
            eventsDataArray.push(eventLite);
        }
        catch (err) {
            console.log(err, jsonEvent);
        }
    }
    //  const eventsDataArrayToJson = Object.assign({}, eventsDataArray)
    let uniqueEventArray = Array.from(new Set(eventsDataArray));
    const jsonArrayToWrite = JSON.stringify(uniqueEventArray);
    if (fs_1.default.existsSync(path_1.default.join(__dirname, "..", "..", "..", "data/events.json"))) {
        fs_1.default.rmSync(path_1.default.join(__dirname, "..", "..", "..", "data/events.json"));
    }
    console.log("file successfully create");
    fs_1.default.writeFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/events.json'), jsonArrayToWrite, 'utf8');
    fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/datatourismeEvents'), { recursive: true, force: true });
    fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/datatourisme_events.zip'), { recursive: true, force: true });
}
exports.EventsToArray = EventsToArray;
async function SitesToArray() {
    const dirs = [];
    const subDirs = [];
    const jsonEventsPaths = [];
    const eventsDataArray = [];
    const rootDir = fs_1.default.readdirSync(KsitesDir);
    //Get first dir paths level
    for await (const dir of rootDir) {
        if (!dir.endsWith('.DS_Store')) {
            dirs.push(path_1.default.join(__dirname, '..', '..', '..', `data/datatourismeSites/objects/${dir}`));
        }
    }
    //Second dir paths level
    for await (const dirPath of dirs) {
        const subDirPath = fs_1.default.readdirSync(dirPath);
        for await (const subdir of subDirPath) {
            if (!subdir.endsWith('.DS_Store')) {
                subDirs.push(path_1.default.join(`${dirPath}/${subdir}`));
            }
        }
    }
    // Create json path array
    for await (const subdirPath of subDirs) {
        const jsonPath = fs_1.default.readdirSync(subdirPath);
        for await (const jsonfilePath of jsonPath)
            jsonEventsPaths.push(path_1.default.join(`${subdirPath}/${jsonfilePath}`));
    }
    console.log('start creating sites array');
    for await (const jsonEvent of jsonEventsPaths) {
        const eventLite = {
            identifier: '',
            themes: [],
            itemNameFr: '',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            creationDate: '',
            address: [],
            city: '',
            zip: '',
            lat: '',
            lng: '',
            schemaLogo: '',
            tel: [],
            web: '',
            img: '',
            descriptionFr: '',
            shortDescriptionFr: '',
            price: '',
            minPrice: '',
            maxPrice: '',
        };
        try {
            const jsonEventPath = JSON.parse(fs_1.default.readFileSync(jsonEvent, 'utf8'));
            eventLite.identifier = jsonEventPath["dc:identifier"];
            eventLite.themes = jsonEventPath['@type'];
            eventLite.itemNameFr = jsonEventPath['rdfs:label']['fr'][0];
            eventLite.creationDate = jsonEventPath['creationDate'];
            eventLite.startDate = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['startDate'] ? jsonEventPath['takesPlaceAt'][0]['startDate'] : null;
            eventLite.endDate = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['endDate'] ? jsonEventPath['takesPlaceAt'][0]['endDate'] : null;
            eventLite.startTime = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['startTime'] ? jsonEventPath['takesPlaceAt'][0]['startTime'] : null;
            eventLite.endTime = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['endTime'] ? jsonEventPath['takesPlaceAt'][0]['endTime'] : null;
            eventLite.address = jsonEventPath['isLocatedAt'][0]['schema:address'][0]['schema:streetAddress'];
            eventLite.city = jsonEventPath['isLocatedAt'][0]['schema:address'][0]['schema:addressLocality'].toString();
            eventLite.zip = jsonEventPath['isLocatedAt'][0]['schema:address'][0]['schema:postalCode'].toString();
            eventLite.lat = jsonEventPath['isLocatedAt'][0]['schema:geo']['schema:latitude'];
            eventLite.lng = jsonEventPath['isLocatedAt'][0]['schema:geo']['schema:longitude'];
            eventLite.schemaLogo = jsonEventPath['hasBeenPublishedBy'] && jsonEventPath['hasBeenPublishedBy'][0]['schema:logo'] ? jsonEventPath['hasBeenPublishedBy'][0]['schema:logo'] : null;
            eventLite.tel = jsonEventPath['hasContact'] && jsonEventPath['hasContact'][0]['schema:telephone'] ? jsonEventPath['hasContact'][0]['schema:telephone'] : null;
            eventLite.web = jsonEventPath['hasContact'] && jsonEventPath['hasContact'][0]["foaf:homepage"] ? jsonEventPath['hasContact'][0]["foaf:homepage"][0].toString() : null;
            eventLite.img = jsonEventPath["hasMainRepresentation"] && jsonEventPath["hasMainRepresentation"][0]['ebucore:hasRelatedResource'] ? eventLite.img = jsonEventPath["hasMainRepresentation"][0]['ebucore:hasRelatedResource'][0]['ebucore:locator'].toString() : null;
            eventLite.descriptionFr = jsonEventPath['hasDescription'] && jsonEventPath['hasDescription'][0]['dc:description'] && jsonEventPath['hasDescription'][0]['dc:description']['fr'] ? jsonEventPath['hasDescription'][0]['dc:description']['fr'][0].toString() : null;
            eventLite.shortDescriptionFr = jsonEventPath['hasDescription'] && jsonEventPath['hasDescription'][0]['shortDescription'] && jsonEventPath['hasDescription'][0]['shortDescription']['fr'] ? jsonEventPath['hasDescription'][0]['shortDescription']['fr'][0].toString() : null;
            eventLite.price = jsonEventPath['offers'] && jsonEventPath['offers'][0]['schema:priceSpecification'] ? jsonEventPath['offers'][0]['schema:priceSpecification'][0]['schema:price'] : null;
            eventLite.minPrice = jsonEventPath['offers'] && jsonEventPath['offers'][0]['schema:priceSpecification'] ? jsonEventPath['offers'][0]['schema:priceSpecification'][0]['schema:minPrice'] : null;
            eventLite.maxPrice = jsonEventPath['offers'] && jsonEventPath['offers'][0]['schema:priceSpecification'] ? jsonEventPath['offers'][0]['schema:priceSpecification'][0]['schema:maxPrice'] : null;
            eventsDataArray.push(eventLite);
        }
        catch (err) {
            console.log(err, jsonEvent);
        }
    }
    //  const eventsDataArrayToJson = Object.assign({}, eventsDataArray)
    const jsonArrayToWrite = JSON.stringify(eventsDataArray);
    if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', '..', '..', 'data/sites.json'))) {
        fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/sites.json'));
    }
    console.log("file successfully create");
    fs_1.default.writeFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/sites.json'), jsonArrayToWrite, 'utf8');
    fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/datatourismeSites'), { recursive: true, force: true });
    fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/datatourisme_sites.zip'), { recursive: true, force: true });
}
exports.SitesToArray = SitesToArray;
async function productsToArray() {
    const dirs = [];
    const subDirs = [];
    const jsonEventsPaths = [];
    const eventsDataArray = [];
    const rootDir = fs_1.default.readdirSync(KproductsDir);
    //Get first dir paths level
    for await (const dir of rootDir) {
        if (!dir.endsWith('.DS_Store')) {
            dirs.push(path_1.default.join(__dirname, '..', '..', '..', `data/datatourismeProducts/objects/${dir}`));
        }
    }
    //Second dir paths level
    for await (const dirPath of dirs) {
        const subDirPath = fs_1.default.readdirSync(dirPath);
        for await (const subdir of subDirPath) {
            if (!subdir.endsWith('.DS_Store')) {
                subDirs.push(path_1.default.join(`${dirPath}/${subdir}`));
            }
        }
    }
    // Create json path array
    for await (const subdirPath of subDirs) {
        const jsonPath = fs_1.default.readdirSync(subdirPath);
        for await (const jsonfilePath of jsonPath)
            jsonEventsPaths.push(path_1.default.join(`${subdirPath}/${jsonfilePath}`));
    }
    console.log('start creating products array');
    for await (const jsonEvent of jsonEventsPaths) {
        const eventLite = {
            identifier: '',
            themes: [],
            itemNameFr: '',
            creationDate: '',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            address: [],
            city: '',
            zip: '',
            lat: '',
            lng: '',
            schemaLogo: '',
            tel: [],
            web: '',
            img: '',
            descriptionFr: '',
            shortDescriptionFr: '',
            price: '',
            minPrice: '',
            maxPrice: '',
        };
        try {
            const jsonEventPath = JSON.parse(fs_1.default.readFileSync(jsonEvent, 'utf8'));
            eventLite.identifier = jsonEventPath["dc:identifier"];
            eventLite.themes = jsonEventPath['@type'];
            eventLite.itemNameFr = jsonEventPath['rdfs:label']['fr'][0];
            eventLite.creationDate = jsonEventPath['creationDate'];
            eventLite.startDate = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['startDate'] ? jsonEventPath['takesPlaceAt'][0]['startDate'] : (0, moment_1.default)().format("YYYY-MM-DD");
            eventLite.endDate = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['endDate'] ? jsonEventPath['takesPlaceAt'][0]['endDate'] : (0, moment_1.default)().format("YYYY-MM-DD");
            eventLite.startTime = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['startTime'] ? jsonEventPath['takesPlaceAt'][0]['startTime'] : null;
            eventLite.endTime = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['endTime'] ? jsonEventPath['takesPlaceAt'][0]['endTime'] : null;
            eventLite.address = jsonEventPath['isLocatedAt'][0]['schema:address'][0]['schema:streetAddress'];
            eventLite.city = jsonEventPath['isLocatedAt'][0]['schema:address'][0]['schema:addressLocality'].toString();
            eventLite.zip = jsonEventPath['isLocatedAt'][0]['schema:address'][0]['schema:postalCode'].toString();
            eventLite.lat = jsonEventPath['isLocatedAt'][0]['schema:geo']['schema:latitude'];
            eventLite.lng = jsonEventPath['isLocatedAt'][0]['schema:geo']['schema:longitude'];
            eventLite.schemaLogo = jsonEventPath['hasBeenPublishedBy'] && jsonEventPath['hasBeenPublishedBy'][0]['schema:logo'] ? jsonEventPath['hasBeenPublishedBy'][0]['schema:logo'] : null;
            eventLite.tel = jsonEventPath['hasContact'] && jsonEventPath['hasContact'][0]['schema:telephone'] ? jsonEventPath['hasContact'][0]['schema:telephone'] : null;
            eventLite.web = jsonEventPath['hasContact'] && jsonEventPath['hasContact'][0]["foaf:homepage"] ? jsonEventPath['hasContact'][0]["foaf:homepage"][0].toString() : null;
            eventLite.img = jsonEventPath["hasMainRepresentation"] && jsonEventPath["hasMainRepresentation"][0]['ebucore:hasRelatedResource'] ? eventLite.img = jsonEventPath["hasMainRepresentation"][0]['ebucore:hasRelatedResource'][0]['ebucore:locator'].toString() : null;
            eventLite.descriptionFr = jsonEventPath['hasDescription'] && jsonEventPath['hasDescription'][0]['dc:description'] && jsonEventPath['hasDescription'][0]['dc:description']['fr'] ? jsonEventPath['hasDescription'][0]['dc:description']['fr'][0].toString() : null;
            eventLite.shortDescriptionFr = jsonEventPath['hasDescription'] && jsonEventPath['hasDescription'][0]['shortDescription'] && jsonEventPath['hasDescription'][0]['shortDescription']['fr'] ? jsonEventPath['hasDescription'][0]['shortDescription']['fr'][0].toString() : null;
            eventLite.price = jsonEventPath['offers'] && jsonEventPath['offers'][0]['schema:priceSpecification'] ? jsonEventPath['offers'][0]['schema:priceSpecification'][0]['schema:price'] : null;
            eventLite.minPrice = jsonEventPath['offers'] && jsonEventPath['offers'][0]['schema:priceSpecification'] ? jsonEventPath['offers'][0]['schema:priceSpecification'][0]['schema:minPrice'] : null;
            eventLite.maxPrice = jsonEventPath['offers'] && jsonEventPath['offers'][0]['schema:priceSpecification'] ? jsonEventPath['offers'][0]['schema:priceSpecification'][0]['schema:maxPrice'] : null;
            eventsDataArray.push(eventLite);
        }
        catch (err) {
            console.log(err, jsonEvent);
        }
    }
    //  const eventsDataArrayToJson = Object.assign({}, eventsDataArray)
    let uniqueProductsArray = Array.from(new Set(eventsDataArray));
    const jsonArrayToWrite = JSON.stringify(uniqueProductsArray);
    if (fs_1.default.existsSync("data/products.json")) {
        fs_1.default.rmSync("data/products.json");
    }
    console.log("file successfully create");
    fs_1.default.writeFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/products.json'), jsonArrayToWrite, 'utf8');
    fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/datatourismeProducts'), { recursive: true, force: true });
    fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/datatourisme_products.zip'), { recursive: true, force: true });
    return uniqueProductsArray;
}
exports.productsToArray = productsToArray;
async function hikingToArray() {
    const dirs = [];
    const subDirs = [];
    const jsonEventsPaths = [];
    const eventsDataArray = [];
    const rootDir = fs_1.default.readdirSync(KhikingDir);
    //Get first dir paths level
    for await (const dir of rootDir) {
        if (!dir.endsWith('.DS_Store')) {
            dirs.push(path_1.default.join(__dirname, '..', '..', '..', `data/datatourismeHiking/objects/${dir}`));
        }
    }
    //Second dir paths level
    for await (const dirPath of dirs) {
        const subDirPath = fs_1.default.readdirSync(dirPath);
        for await (const subdir of subDirPath) {
            if (!subdir.endsWith('.DS_Store')) {
                subDirs.push(path_1.default.join(`${dirPath}/${subdir}`));
            }
        }
    }
    // Create json path array
    for await (const subdirPath of subDirs) {
        const jsonPath = fs_1.default.readdirSync(subdirPath);
        for await (const jsonfilePath of jsonPath)
            jsonEventsPaths.push(path_1.default.join(`${subdirPath}/${jsonfilePath}`));
    }
    console.log('start creating hiking array');
    for await (const jsonEvent of jsonEventsPaths) {
        const eventLite = {
            identifier: '',
            themes: [],
            itemNameFr: '',
            creationDate: '',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            address: [],
            city: '',
            zip: '',
            lat: '',
            lng: '',
            schemaLogo: '',
            tel: [],
            web: '',
            img: '',
            descriptionFr: '',
            shortDescriptionFr: '',
            price: '',
            minPrice: '',
            maxPrice: '',
        };
        try {
            const jsonEventPath = JSON.parse(fs_1.default.readFileSync(jsonEvent, 'utf8'));
            eventLite.identifier = jsonEventPath["dc:identifier"] ? jsonEventPath["dc:identifier"] : (jsonEventPath['rdfs:label']['fr'][0] + jsonEventPath['creationDate'].trim());
            eventLite.themes = jsonEventPath['@type'];
            eventLite.itemNameFr = jsonEventPath['rdfs:label']['fr'][0];
            eventLite.creationDate = jsonEventPath['creationDate'];
            eventLite.startDate = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['startDate'] ? jsonEventPath['takesPlaceAt'][0]['startDate'] : (0, moment_1.default)().format("YYYY-MM-DD");
            eventLite.endDate = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['endDate'] ? jsonEventPath['takesPlaceAt'][0]['endDate'] : (0, moment_1.default)().format("YYYY-MM-DD");
            eventLite.startTime = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['startTime'] ? jsonEventPath['takesPlaceAt'][0]['startTime'] : null;
            eventLite.endTime = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['endTime'] ? jsonEventPath['takesPlaceAt'][0]['endTime'] : null;
            eventLite.address = jsonEventPath['isLocatedAt'][0]['schema:address'][0]['schema:streetAddress'];
            eventLite.city = jsonEventPath['isLocatedAt'][0]['schema:address'][0]['schema:addressLocality'].toString();
            eventLite.zip = jsonEventPath['isLocatedAt'][0]['schema:address'][0]['schema:postalCode'].toString();
            eventLite.lat = jsonEventPath['isLocatedAt'][0]['schema:geo']['schema:latitude'];
            eventLite.lng = jsonEventPath['isLocatedAt'][0]['schema:geo']['schema:longitude'];
            eventLite.schemaLogo = jsonEventPath['hasBeenPublishedBy'] && jsonEventPath['hasBeenPublishedBy'][0]['schema:logo'] ? jsonEventPath['hasBeenPublishedBy'][0]['schema:logo'] : null;
            eventLite.tel = jsonEventPath['hasContact'] && jsonEventPath['hasContact'][0]['schema:telephone'] ? jsonEventPath['hasContact'][0]['schema:telephone'] : null;
            eventLite.web = jsonEventPath['hasContact'] && jsonEventPath['hasContact'][0]["foaf:homepage"] ? jsonEventPath['hasContact'][0]["foaf:homepage"][0].toString() : null;
            eventLite.img = jsonEventPath["hasMainRepresentation"] && jsonEventPath["hasMainRepresentation"][0]['ebucore:hasRelatedResource'] ? eventLite.img = jsonEventPath["hasMainRepresentation"][0]['ebucore:hasRelatedResource'][0]['ebucore:locator'].toString() : null;
            eventLite.descriptionFr = jsonEventPath['hasDescription'] && jsonEventPath['hasDescription'][0]['dc:description'] && jsonEventPath['hasDescription'][0]['dc:description']['fr'] ? jsonEventPath['hasDescription'][0]['dc:description']['fr'][0].toString() : null;
            eventLite.shortDescriptionFr = jsonEventPath['hasDescription'] && jsonEventPath['hasDescription'][0]['shortDescription'] && jsonEventPath['hasDescription'][0]['shortDescription']['fr'] ? jsonEventPath['hasDescription'][0]['shortDescription']['fr'][0].toString() : null;
            eventLite.price = jsonEventPath['offers'] && jsonEventPath['offers'][0]['schema:priceSpecification'] ? jsonEventPath['offers'][0]['schema:priceSpecification'][0]['schema:price'] : null;
            eventLite.minPrice = jsonEventPath['offers'] && jsonEventPath['offers'][0]['schema:priceSpecification'] ? jsonEventPath['offers'][0]['schema:priceSpecification'][0]['schema:minPrice'] : null;
            eventLite.maxPrice = jsonEventPath['offers'] && jsonEventPath['offers'][0]['schema:priceSpecification'] ? jsonEventPath['offers'][0]['schema:priceSpecification'][0]['schema:maxPrice'] : null;
            eventsDataArray.push(eventLite);
        }
        catch (err) {
            console.log(err, jsonEvent);
        }
    }
    //  const eventsDataArrayToJson = Object.assign({}, eventsDataArray)
    const jsonArrayToWrite = JSON.stringify(eventsDataArray);
    if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', '..', '..', 'data/hiking.json'))) {
        fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/hiking.json'));
    }
    console.log("file successfully create");
    fs_1.default.writeFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/hiking.json'), jsonArrayToWrite, 'utf8');
    fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/datatourismeHiking'), { recursive: true, force: true });
    fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/datatourisme_hiking.zip'), { recursive: true, force: true });
}
exports.hikingToArray = hikingToArray;
async function activitiesToArray() {
    const dirs = [];
    const subDirs = [];
    const jsonEventsPaths = [];
    const eventsDataArray = [];
    const rootDir = fs_1.default.readdirSync(KactivitiesDir);
    //Get first dir paths level
    for await (const dir of rootDir) {
        if (!dir.endsWith('.DS_Store')) {
            dirs.push(path_1.default.join(__dirname, '..', '..', '..', `data/datatourismeActivities/objects/${dir}`));
        }
    }
    //Second dir paths level
    for await (const dirPath of dirs) {
        const subDirPath = fs_1.default.readdirSync(dirPath);
        for await (const subdir of subDirPath) {
            if (!subdir.endsWith('.DS_Store')) {
                subDirs.push(path_1.default.join(`${dirPath}/${subdir}`));
            }
        }
    }
    // Create json path array
    for await (const subdirPath of subDirs) {
        const jsonPath = fs_1.default.readdirSync(subdirPath);
        for await (const jsonfilePath of jsonPath)
            jsonEventsPaths.push(path_1.default.join(`${subdirPath}/${jsonfilePath}`));
    }
    console.log('start creating activities array');
    for await (const jsonEvent of jsonEventsPaths) {
        const eventLite = {
            identifier: '',
            themes: [],
            itemNameFr: '',
            creationDate: '',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            address: [],
            city: '',
            zip: '',
            lat: '',
            lng: '',
            schemaLogo: '',
            tel: [],
            web: '',
            img: '',
            descriptionFr: '',
            shortDescriptionFr: '',
            price: '',
            minPrice: '',
            maxPrice: '',
        };
        try {
            const jsonEventPath = JSON.parse(fs_1.default.readFileSync(jsonEvent, 'utf8'));
            eventLite.identifier = jsonEventPath["dc:identifier"];
            eventLite.themes = jsonEventPath['@type'];
            eventLite.itemNameFr = jsonEventPath['rdfs:label']['fr'][0];
            eventLite.creationDate = jsonEventPath['creationDate'];
            eventLite.startDate = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['startDate'] ? jsonEventPath['takesPlaceAt'][0]['startDate'] : (0, moment_1.default)().format("YYYY-MM-DD");
            eventLite.endDate = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['endDate'] ? jsonEventPath['takesPlaceAt'][0]['endDate'] : (0, moment_1.default)().format("YYYY-MM-DD");
            eventLite.startTime = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['startTime'] ? jsonEventPath['takesPlaceAt'][0]['startTime'] : null;
            eventLite.endTime = jsonEventPath['takesPlaceAt'] && jsonEventPath['takesPlaceAt'][0]['endTime'] ? jsonEventPath['takesPlaceAt'][0]['endTime'] : null;
            eventLite.address = jsonEventPath['isLocatedAt'][0]['schema:address'][0]['schema:streetAddress'];
            eventLite.city = jsonEventPath['isLocatedAt'][0]['schema:address'][0]['schema:addressLocality'].toString();
            eventLite.zip = jsonEventPath['isLocatedAt'][0]['schema:address'][0]['schema:postalCode'].toString();
            eventLite.lat = jsonEventPath['isLocatedAt'][0]['schema:geo']['schema:latitude'];
            eventLite.lng = jsonEventPath['isLocatedAt'][0]['schema:geo']['schema:longitude'];
            eventLite.schemaLogo = jsonEventPath['hasBeenPublishedBy'] && jsonEventPath['hasBeenPublishedBy'][0]['schema:logo'] ? jsonEventPath['hasBeenPublishedBy'][0]['schema:logo'] : null;
            eventLite.tel = jsonEventPath['hasContact'] && jsonEventPath['hasContact'][0]['schema:telephone'] ? jsonEventPath['hasContact'][0]['schema:telephone'] : null;
            eventLite.web = jsonEventPath['hasContact'] && jsonEventPath['hasContact'][0]["foaf:homepage"] ? jsonEventPath['hasContact'][0]["foaf:homepage"][0].toString() : null;
            eventLite.img = jsonEventPath["hasMainRepresentation"] && jsonEventPath["hasMainRepresentation"][0]['ebucore:hasRelatedResource'] ? eventLite.img = jsonEventPath["hasMainRepresentation"][0]['ebucore:hasRelatedResource'][0]['ebucore:locator'].toString() : null;
            eventLite.descriptionFr = jsonEventPath['hasDescription'] && jsonEventPath['hasDescription'][0]['dc:description'] && jsonEventPath['hasDescription'][0]['dc:description']['fr'] ? jsonEventPath['hasDescription'][0]['dc:description']['fr'][0].toString() : null;
            eventLite.shortDescriptionFr = jsonEventPath['hasDescription'] && jsonEventPath['hasDescription'][0]['shortDescription'] && jsonEventPath['hasDescription'][0]['shortDescription']['fr'] ? jsonEventPath['hasDescription'][0]['shortDescription']['fr'][0].toString() : null;
            eventLite.price = jsonEventPath['offers'] && jsonEventPath['offers'][0]['schema:priceSpecification'] ? jsonEventPath['offers'][0]['schema:priceSpecification'][0]['schema:price'] : null;
            eventLite.minPrice = jsonEventPath['offers'] && jsonEventPath['offers'][0]['schema:priceSpecification'] ? jsonEventPath['offers'][0]['schema:priceSpecification'][0]['schema:minPrice'] : null;
            eventLite.maxPrice = jsonEventPath['offers'] && jsonEventPath['offers'][0]['schema:priceSpecification'] ? jsonEventPath['offers'][0]['schema:priceSpecification'][0]['schema:maxPrice'] : null;
            eventsDataArray.push(eventLite);
        }
        catch (err) {
            console.log(err, jsonEvent);
        }
    }
    //  const eventsDataArrayToJson = Object.assign({}, eventsDataArray)
    let uniqueActivitiesArray = Array.from(new Set(eventsDataArray));
    const jsonArrayToWrite = JSON.stringify(uniqueActivitiesArray);
    if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', '..', '..', 'data/activities.json'))) {
        fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/activities.json'));
    }
    console.log("file successfully create");
    fs_1.default.writeFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/activities.json'), jsonArrayToWrite, 'utf8');
    fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/datatourismeActivities'), { recursive: true, force: true });
    fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/datatourisme_Activities.zip'), { recursive: true, force: true });
}
exports.activitiesToArray = activitiesToArray;
async function newsEvents() {
    const now = (0, moment_1.default)().format("YYYY-MM-DD");
    const kEvents = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/events.json')).toString());
    const kProducts = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/products.json')).toString());
    const kswpEvents = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/sowprogEvents.json')).toString());
    const kGlobalData = kEvents.concat(kProducts, kswpEvents);
    const newEventsArray = [];
    const sevenDaysEvents = (0, moment_1.default)().add(7, 'd').format("YYYY-MM-DD");
    for await (var event of kGlobalData) {
        const startDateEvent = (0, moment_1.default)(event.startDate, true).format("YYYY-MM-DD");
        if ((0, moment_1.default)(startDateEvent, true).isBetween((0, moment_1.default)(now, true), (0, moment_1.default)(sevenDaysEvents, true)) === true || now == startDateEvent) {
            newEventsArray.push(event);
            //console.log(moment(new Date(), true).isSameOrAfter(moment(startDateEvent, true)), event.startDate, event.endDate);
            //}
        }
    }
    const jsonArrayToWrite = JSON.stringify(newEventsArray);
    if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', '..', '..', 'data/newEvents.json'))) {
        fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/newEvents.json'));
    }
    console.log("file successfully create");
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", "..", "..", "data/newEvents.json"), jsonArrayToWrite, 'utf8');
    console.log("news events successfully created");
}
exports.newsEvents = newsEvents;
async function sowprogEvents() {
    const sowUrl = "https://agenda.sowprog.com/rest/v1_2/scheduledEvents";
    const username = "mikaelwaw@gmail.com";
    const password = "SJOY19150921w$";
    const autBasic = 'Basic ' + Buffer.from(username + ":" + password).toString('base64');
    try {
        const res = await superagent_1.default.get(sowUrl).set('Accept', 'application/json').set('Content-Type', 'application/json').set('authorization', autBasic);
        const response = res.body;
        const sowEvents = response['eventDescription'];
        //console.log(sowEvents[3]['eventPrice'][0]['price']);
        const dataArray = [];
        for (const event of sowEvents) {
            // console.log(event);
            const eventLite = {
                identifier: '',
                themes: [],
                itemNameFr: '',
                creationDate: '',
                startDate: '',
                endDate: '',
                startTime: '',
                endTime: '',
                address: [],
                city: '',
                zip: '',
                lat: '',
                lng: '',
                schemaLogo: '',
                tel: [],
                web: '',
                img: '',
                descriptionFr: '',
                shortDescriptionFr: '',
                price: '',
                minPrice: [],
                maxPrice: [],
            };
            eventLite.identifier = event.id.toString();
            eventLite.themes = ['Concert', 'sowprog'];
            eventLite.itemNameFr = event.event.title;
            eventLite.creationDate = event.creationDate.toString();
            eventLite.startDate = event.eventSchedule.startDate;
            eventLite.endDate = event.eventSchedule.endDate;
            eventLite.startTime = "noTime";
            eventLite.endTime = "notime";
            eventLite.address = [event.location.contact.addressLine1];
            eventLite.city = event.location.contact.city;
            eventLite.zip = event.location.contact.zipCode.toString();
            eventLite.lat = event.location.contact.lattitude;
            eventLite.lng = event.location.contact.longitude;
            eventLite.tel = [event.location.contact.phone1] ?? null;
            eventLite.web = event.event.website ?? null;
            eventLite.img = event.event.picture ?? null;
            eventLite.schemaLogo = event.location.logo ?? null;
            eventLite.descriptionFr = event.event.punchline.toString();
            eventLite.shortDescriptionFr = event.event.description.toString() ?? null;
            eventLite.price = event.eventPrice ? event.eventPrice[0]['price'].toString() : null;
            eventLite.minPrice = [event.eventPrice ? event.eventPrice[0]['price'].toString() : ""];
            eventLite.maxPrice = [event.eventPrice && event.eventPrice[1] ? event.eventPrice[1]['price'].toString() : ""];
            dataArray.push(eventLite);
        }
        let uniqueActivitiesArray = Array.from(new Set(dataArray));
        const jsonArrayToWrite = JSON.stringify(uniqueActivitiesArray);
        if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', '..', '..', 'data/sowprogEvents.json'))) {
            fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/sowprogEvents.json'));
        }
        console.log("file successfully create");
        fs_1.default.writeFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/sowprogEvents.json'), jsonArrayToWrite, 'utf8');
    }
    catch (e) {
        console.error(e);
    }
}
exports.sowprogEvents = sowprogEvents;
async function theatreContempo() {
    const allShowsUrl = `https://www.theatre-contemporain.net/api/spectacles/{}?k=${process.env.TC_API_KEY}`;
    const getRequest = await superagent_1.default.get(allShowsUrl);
    const res = JSON.parse(getRequest.text);
    const shows = res[1]['datas'];
    for (const show of shows) {
        const showDataRequest = await superagent_1.default.get(`https://www.theatre-contemporain.net/api/spectacles/${show.url_clean}?k=${process.env.TC_API_KEY}`);
        console.log(showDataRequest);
        const showData = JSON.parse(showDataRequest.text);
        // console.log(showData);
    }
}
exports.theatreContempo = theatreContempo;
