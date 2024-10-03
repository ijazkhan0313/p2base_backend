"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isJsonParsable = exports.bannerEventsFilter = exports.diffAdsFilter = exports.todayFilter = exports.categorie10 = exports.categorie9 = exports.categorie8 = exports.categorie7 = exports.categorie6 = exports.categorie5 = exports.categorie4 = exports.categorie3 = exports.categorie2 = exports.categorie1 = exports.newsEvents = void 0;
const moment_1 = __importDefault(require("moment"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
async function newsEvents() {
    const now = (0, moment_1.default)().format("YYYY-MM-DD");
    const kEvents = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/events.json')).toString());
    const kProducts = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/products.json')).toString());
    const kswpEvents = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/sowprogEvents.json')).toString());
    const Kp2bEvents = fs_1.default.existsSync(path_1.default.join(__dirname, "..", "..", "..", 'data/p2bEvents.json')) ? JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "..", "..", 'data/p2bEvents.json')).toString()) : [];
    const kGlobalData = kEvents.concat(kProducts, kswpEvents, Kp2bEvents);
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
// Vide Greniers & Brocantes
async function categorie1() {
    const kEvents = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/events.json')).toString());
    const bricBracEvents = [];
    for await (var event of kEvents) {
        if (event.themes.includes("BricABrac") || event.themes.includes("GarageSale")) {
            bricBracEvents.push(event);
        }
    }
    const jsonArrayToWrite = JSON.stringify(bricBracEvents);
    if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie1.json'))) {
        fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie1.json'));
    }
    console.log("file successfully create");
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", "..", "..", "data/categorie1.json"), jsonArrayToWrite, 'utf8');
    console.log("BricBrac successfully created");
    await todayFilter(bricBracEvents, 'todayCategory1');
}
exports.categorie1 = categorie1;
//Famille
async function categorie2() {
    const kEvents = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/events.json')).toString());
    const Kactivities = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "..", "..", 'data/activities.json')).toString());
    const globalData = kEvents.concat(Kactivities);
    const familyEvents = [];
    for await (var event of globalData) {
        if (event.themes.includes("Game") ||
            event.themes.includes("show_events") ||
            event.themes.includes("PlayArea") ||
            event.themes.includes("TraditionalCelebration") ||
            event.themes.includes("ChildrensEvent") ||
            event.themes.includes("Carnival") ||
            event.themes.includes("ScreeningEvent") ||
            event.themes.includes("Rally") ||
            event.themes.includes("NauticalCentre") ||
            event.themes.includes("KidsClub") ||
            event.themes.includes("ZooAnimalPark") ||
            event.themes.includes("TeachingFarm") ||
            event.themes.includes("ViaFerrata") ||
            event.themes.includes("ThemePark")) {
            familyEvents.push(event);
        }
    }
    const jsonArrayToWrite = JSON.stringify(familyEvents);
    if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie2.json'))) {
        fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie2.json'));
    }
    console.log("file successfully create");
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", "..", "..", "data/categorie2.json"), jsonArrayToWrite, 'utf8');
    console.log("Family successfully created");
    await todayFilter(familyEvents, 'todayCategory2');
}
exports.categorie2 = categorie2;
//Expositions
async function categorie3() {
    const kEvents = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/events.json')).toString());
    const exhibEvents = [];
    for await (var event of kEvents) {
        if (event.themes.includes("Exhibition")) {
            exhibEvents.push(event);
        }
    }
    const jsonArrayToWrite = JSON.stringify(exhibEvents);
    if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie3.json'))) {
        fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie3.json'));
    }
    console.log("file successfully create");
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", "..", "..", "data/categorie3.json"), jsonArrayToWrite, 'utf8');
    console.log("Exhibitions successfully created");
    await todayFilter(exhibEvents, 'todayCategory3');
}
exports.categorie3 = categorie3;
//Spectacles concerts bals
async function categorie4() {
    const kEvents = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/events.json')).toString());
    const KsowprogEvents = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "..", "..", 'data/sowprogEvents.json')).toString());
    const globalData = kEvents.concat(KsowprogEvents);
    const showEvents = [];
    for await (var event of globalData) {
        if (event.themes.includes("Recital") ||
            event.themes.includes("DanceEvent") ||
            event.themes.includes("Opera") ||
            event.themes.includes("ShowEvent") ||
            event.themes.includes("show_events") ||
            event.themes.includes("TheaterEvent") ||
            event.themes.includes("VisualArtsEvent") ||
            event.themes.includes("TraditionalCelebration") ||
            event.themes.includes("Concert") ||
            event.themes.includes("schema:MusicEvent") ||
            event.themes.includes("sowprog") ||
            event.themes.includes("Carnival") ||
            event.themes.includes("CircusEvent") ||
            event.themes.includes("Festival" ||
                event.themes.includes("CircusPlace"))) {
            showEvents.push(event);
        }
    }
    const jsonArrayToWrite = JSON.stringify(showEvents);
    if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie4.json'))) {
        fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie4.json'));
    }
    console.log("file successfully create");
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", "..", "..", "data/categorie4.json"), jsonArrayToWrite, 'utf8');
    console.log("Show & party successfully created");
    await todayFilter(showEvents, 'todayCategory4');
}
exports.categorie4 = categorie4;
//Sports - Loisirs
async function categorie5() {
    const kEvents = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/events.json')).toString());
    const kProducts = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "..", "..", 'data/products.json')).toString());
    const kHiking = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "..", "..", 'data/hiking.json')).toString());
    const kActivities = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "..", "..", 'data/activities.json')).toString());
    const globalData = kEvents.concat(kProducts, kHiking, kActivities);
    const sportEvents = [];
    for await (var event of globalData) {
        if (event.themes.includes("Rambling") ||
            event.themes.includes("SportsEvent") ||
            event.themes.includes("DownhillSkiResort") ||
            event.themes.includes("CrossCountrySkiResort") ||
            event.themes.includes("BeachClub") ||
            event.themes.includes("TrackRollerOrSkateBoard") ||
            event.themes.includes("DownhillSkiRun") ||
            event.themes.includes("CrossCountrySkiTrail") ||
            event.themes.includes("SportsClub") ||
            event.themes.includes("Trampoline") ||
            event.themes.includes("EquestrianCenter") ||
            event.themes.includes("KidsClub") ||
            event.themes.includes("LeisureComplex") ||
            event.themes.includes("TennisComplex") ||
            event.themes.includes("SportsCompetition") ||
            event.themes.includes("BalneotherapyCentre") ||
            event.themes.includes("Rally") ||
            event.themes.includes("SportsDemonstration") ||
            event.themes.includes("TobogganBobsleigh") ||
            event.themes.includes("IceSkatingRink") ||
            event.themes.includes("BowlingAlley") ||
            event.themes.includes("Competition") ||
            event.themes.includes("GolfCourse") ||
            event.themes.includes("BoulesPitch") ||
            event.themes.includes("FirstPractice") ||
            event.themes.includes("Course") ||
            event.themes.includes("Harvest") ||
            event.themes.includes("FitnessPath") ||
            event.themes.includes("Racetrack") ||
            event.themes.includes("FitnessCenter") ||
            event.themes.includes("MiniGolf") ||
            event.themes.includes("Velodrome") ||
            event.themes.includes("FrontonBelotaCourt") ||
            event.themes.includes("SwimmingPool") ||
            event.themes.includes("DogSleddingTrail") ||
            event.themes.includes("Hammam") ||
            event.themes.includes("SportsHall") ||
            event.themes.includes("ViaFerrata") ||
            event.themes.includes("EducationalTrail") ||
            event.themes.includes("BilliardRoom") ||
            event.themes.includes("Stadium") ||
            event.themes.includes("MultiPurposeRoomOrCommunityRoom") ||
            event.themes.includes("SquashCourt") ||
            event.themes.includes("Gymnasium") ||
            event.themes.includes("IntroductionCourse") ||
            event.themes.includes("FirstPractice") ||
            event.themes.includes("ClimbingWall") ||
            event.themes.includes("SummerToboggan") ||
            event.themes.includes("RacingCircuit")) {
            sportEvents.push(event);
        }
    }
    const jsonArrayToWrite = JSON.stringify(sportEvents);
    if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie5.json'))) {
        fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie5.json'));
    }
    console.log("file successfully create");
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", "..", "..", "data/categorie5.json"), jsonArrayToWrite, 'utf8');
    console.log("sports successfully created");
    await todayFilter(sportEvents, 'todayCategory5');
}
exports.categorie5 = categorie5;
//Évènements culturels
async function categorie6() {
    const kEvents = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/events.json')).toString());
    const culturalEvents = [];
    for await (var event of kEvents) {
        if (event.themes.includes("Congress") ||
            event.themes.includes("Seminar") ||
            event.themes.includes("CulturalEvent") ||
            event.themes.includes("Reading") ||
            event.themes.includes("OpenDay") ||
            event.themes.includes("ArtistSigning") ||
            event.themes.includes("SocialEvent") ||
            event.themes.includes("TrainingWorkshop") ||
            event.themes.includes("Conference") ||
            event.themes.includes("SchoolOrTrainingCentre") ||
            event.themes.includes("SaleEvent") ||
            event.themes.includes("BusinessEvent")) {
            culturalEvents.push(event);
        }
    }
    const jsonArrayToWrite = JSON.stringify(culturalEvents);
    if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie6.json'))) {
        fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie6.json'));
    }
    console.log("file successfully create");
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", "..", "..", "data/categorie6.json"), jsonArrayToWrite, 'utf8');
    console.log("Cultural successfully created");
    await todayFilter(culturalEvents, 'todayCategory6');
}
exports.categorie6 = categorie6;
//Visites guidées & Théatres
async function categorie7() {
    const kEvents = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/events.json')).toString());
    const events = [];
    for await (var event of kEvents) {
        if (event.themes.includes("VisualArtsEvent") ||
            event.themes.includes("Parade") ||
            event.themes.includes("ScreeningEvent")) {
            events.push(event);
        }
    }
    const jsonArrayToWrite = JSON.stringify(events);
    if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie7.json'))) {
        fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie7.json'));
    }
    console.log("file successfully create");
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", "..", "..", "data/categorie7.json"), jsonArrayToWrite, 'utf8');
    console.log("Theatre successfully created");
    await todayFilter(events, 'todayCategory7');
}
exports.categorie7 = categorie7;
//Fêtes - Marchés - autres
async function categorie8() {
    const kEvents = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/events.json')).toString());
    const marketEvents = [];
    for await (var event of kEvents) {
        if (event.themes.includes("Game") ||
            event.themes.includes("Market") ||
            event.themes.includes("Rally") ||
            event.themes.includes("Carnival") ||
            event.themes.includes("FairOrShow") ||
            event.themes.includes("SocialEvent") ||
            event.themes.includes("TraditionalCelebration") ||
            event.themes.includes("SociaLocalAnimationlEvent" ||
                event.themes.includes("Tasting"))) {
            marketEvents.push(event);
        }
    }
    const jsonArrayToWrite = JSON.stringify(marketEvents);
    if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie8.json'))) {
        fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie8.json'));
    }
    console.log("file successfully create");
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", "..", "..", "data/categorie8.json"), jsonArrayToWrite, 'utf8');
    console.log("Market successfully created");
    await todayFilter(marketEvents, 'todayCategory8');
}
exports.categorie8 = categorie8;
//Itineraires tourisitques
async function categorie9() {
    const kEvents = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "..", "..", 'data/hiking.json')).toString());
    const hikingEvents = [];
    for await (var event of kEvents) {
        if (event.themes.includes("CyclingTour") ||
            event.themes.includes("FluvialTour") ||
            event.themes.includes("walkingTour") ||
            event.themes.includes("RoadTour") ||
            event.themes.includes("HorseTour") ||
            event.themes.includes("UnderwaterRoute")) {
            hikingEvents.push(event);
        }
    }
    const jsonArrayToWrite = JSON.stringify(hikingEvents);
    if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie9.json'))) {
        fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie9.json'));
    }
    console.log("file successfully create");
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", "..", "..", "data/categorie9.json"), jsonArrayToWrite, 'utf8');
    console.log("Hiking successfully created");
    await todayFilter(hikingEvents, 'todayCategory9');
}
exports.categorie9 = categorie9;
//Commémorations
async function categorie10() {
    const kEvents = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '..', '..', '..', 'data/events.json')).toString());
    const comEvents = [];
    for await (var event of kEvents) {
        if (event.themes.includes("PilgrimageAndProcession") ||
            event.themes.includes("ReligiousEvent") ||
            event.themes.includes("Commemoration")) {
            comEvents.push(event);
        }
    }
    const jsonArrayToWrite = JSON.stringify(comEvents);
    if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie10.json'))) {
        fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', 'data/categorie10.json'));
    }
    console.log("file successfully create");
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", "..", "..", "data/categorie10.json"), jsonArrayToWrite, 'utf8');
    console.log("Commemorations successfully created");
    await todayFilter(comEvents, 'todayCategory10');
}
exports.categorie10 = categorie10;
async function todayFilter(eventsArray, fileName) {
    const now = (0, moment_1.default)().format("YYYY-MM-DD");
    const todayEvents = [];
    for (var event of eventsArray) {
        const startDateEvent = (0, moment_1.default)(event.startDate, true).format("YYYY-MM-DD");
        const endDateEvent = (0, moment_1.default)(event.endDate, true).format("YYYY-MM-DD");
        if ((0, moment_1.default)(now, true).isBetween((0, moment_1.default)(startDateEvent, true), (0, moment_1.default)(endDateEvent, true)) === true || now === startDateEvent) {
            //console.log(startDateEvent +' ' + ' - ' + ' ' + endDateEvent + event.city) 
            todayEvents.push(event);
        }
    }
    const jsonArrayToWrite = JSON.stringify(todayEvents);
    if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', '..', '..', `data/${fileName}.json`))) {
        fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', `data/${fileName}.json`));
    }
    console.log("file successfully create");
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", "..", "..", `data/${fileName}.json`), jsonArrayToWrite, 'utf8');
    console.log(`Today ${fileName} successfully created`);
}
exports.todayFilter = todayFilter;
async function diffAdsFilter(eventsArray, fileName) {
    const now = (0, moment_1.default)().format("YYYY-MM-DD");
    const todayEvents = [];
    for (var event of eventsArray) {
        const startDateDiff = (0, moment_1.default)(event.startDiff, true).format("YYYY-MM-DD");
        const endDateDiff = (0, moment_1.default)(event.endDiff, true).format("YYYY-MM-DD");
        if ((0, moment_1.default)(now, true).isBetween((0, moment_1.default)(startDateDiff, true), (0, moment_1.default)(endDateDiff, true)) === true || now === startDateDiff) {
            //console.log(startDateEvent +' ' + ' - ' + ' ' + endDateEvent + event.city) 
            todayEvents.push(event);
        }
    }
    const jsonArrayToWrite = JSON.stringify(todayEvents);
    if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', '..', '..', `data/${fileName}.json`))) {
        fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', `data/${fileName}.json`));
    }
    console.log("file successfully create");
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", "..", "..", `data/${fileName}.json`), jsonArrayToWrite, 'utf8');
    console.log(`Today ${fileName} successfully created`);
}
exports.diffAdsFilter = diffAdsFilter;
async function bannerEventsFilter(eventsArray, fileName) {
    const bannerEvents = [];
    console.log(eventsArray);
    for (const event of eventsArray) {
        if (event.banner === true)
            bannerEvents.push(event);
    }
    const jsonArrayToWrite = JSON.stringify(bannerEvents);
    if (fs_1.default.existsSync(path_1.default.join(__dirname, '..', '..', '..', `data/${fileName}.json`))) {
        fs_1.default.rmSync(path_1.default.join(__dirname, '..', '..', '..', `data/${fileName}.json`));
    }
    console.log("file successfully create");
    fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", "..", "..", `data/${fileName}.json`), jsonArrayToWrite, 'utf8');
    console.log(`${fileName} successfully created`);
}
exports.bannerEventsFilter = bannerEventsFilter;
function isJsonParsable(str) {
    try {
        JSON.parse(str);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.isJsonParsable = isJsonParsable;
