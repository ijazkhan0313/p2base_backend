"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = require("../middlewares/multer");
const jwt_1 = require("../middlewares/jwt");
const events_controller_1 = require("../controllers/events.controller");
const crudEvents_controller_1 = require("../controllers/crudEvents.controller");
const stripe_1 = require("../services/stripe");
/* CATÉGORIES ROUTES EVENTS:
    1: Vide Greniers & Brocantes
    2: Famille
    3: Expositions
    4: Spectacles concerts bals
    5: Évènements Sportifs
    6: Évènements culturels
    7: Visites guidées & Théatres
    8: Fêtes - Marchés - autres
    9: Foires et Salons
    10: Commémorations
  */
async function eventRoutes(router) {
    router.get('/p2base/total-events', crudEvents_controller_1.getTotalEvents);
    router.get('/p2base/new-events/:userLat/:userLng', events_controller_1.getNewsEvents);
    router.get('/p2base/favorits/user/:id', events_controller_1.getFavorits);
    router.get('/p2base/favorits/:id/:userLat/:userLng', events_controller_1.getFavoritesEventsAndGeoloc);
    router.get('/p2base/sites/:userLat/:userLng/:userDist', events_controller_1.getSites);
    router.get('/p2base/category1/:userLat/:userLng/:userDist', events_controller_1.getCategory1Events);
    router.get('/p2base/category2/:userLat/:userLng/:userDist', events_controller_1.getCategory2Events);
    router.get('/p2base/category3/:userLat/:userLng/:userDist', events_controller_1.getCategory3Events);
    router.get('/p2base/category4/:userLat/:userLng/:userDist', events_controller_1.getCategory4Events);
    router.get('/p2base/category5/:userLat/:userLng/:userDist', events_controller_1.getCategory5Events);
    router.get('/p2base/category6/:userLat/:userLng/:userDist', events_controller_1.getCategory6Events);
    router.get('/p2base/category7/:userLat/:userLng/:userDist', events_controller_1.getCategory7Events);
    router.get('/p2base/category8/:userLat/:userLng/:userDist', events_controller_1.getCategory8Events);
    router.get('/p2base/category9/:userLat/:userLng/:userDist', events_controller_1.getCategory9Events);
    router.get('/p2base/category10/:userLat/:userLng/:userDist', events_controller_1.getCategory10Events);
    router.get('/p2base/events/:userLat/:userLng/:userDist', events_controller_1.getSearchEvents);
    //router.get('/events/:filename', getEventImg );
    router.get('/p2base/events/user-events/:email', crudEvents_controller_1.getUserEvents);
    router.get('/p2base/events/all/:email', crudEvents_controller_1.getAllEvents);
    router.get('/p2base/event/:id', events_controller_1.getSingleEvent);
    router.get('/p2base/admin/events/:email', crudEvents_controller_1.getPendingEvents);
    router.get('/p2base/banner-events', events_controller_1.getBannerEvents);
    router.get('/p2base/p2bEvent/:identifier', crudEvents_controller_1.getEventDetails);
    router.post('/p2base/add-event', { preHandler: [jwt_1.verifyToken, multer_1.fieldsUpload] }, crudEvents_controller_1.createEvent);
    router.post('/p2base/validityEventMail', crudEvents_controller_1.sendEventMailIssue);
    router.post('/p2base/event/add-invoice', crudEvents_controller_1.saveInvoiceEvent);
    router.post('/p2base/order', stripe_1.orderEvent);
    router.patch('/p2base/event/:id', { preHandler: multer_1.fieldsUpload }, crudEvents_controller_1.updateEvent);
    router.delete('/p2base/event/:id', crudEvents_controller_1.deleteEvent);
}
module.exports = eventRoutes;
