"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInvoices = exports.saveInvoiceEvent = exports.sendEventMailIssue = exports.deleteEvent = exports.getEventImg = exports.updateEvent = exports.getPendingEvents = exports.getEventDetails = exports.createEvent = exports.getUserEvents = exports.getAdsEvents = exports.getAllEvents = exports.getTotalEvents = void 0;
const events_1 = __importDefault(require("../models/events"));
const invoices_1 = __importDefault(require("../models/invoices"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const moment_1 = __importDefault(require("moment"));
moment_1.default.locale('fr');
const logsLib_1 = require("../utils/logsLib");
const data_services_1 = require("../services/data.services");
const users_1 = __importDefault(require("../models/users"));
const nodemailer_1 = __importDefault(require("nodemailer"));
async function getTotalEvents(req, rep) {
    const userIp = req.ip;
    try {
        const events = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "..", "..", 'data/events.json')).toString());
        const sites = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "..", "..", 'data/sites.json')).toString());
        const activities = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "..", "..", 'data/activities.json')).toString());
        const products = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "..", "..", 'data/products.json')).toString());
        const hiking = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "..", "..", 'data/hiking.json')).toString());
        const swpEvents = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "..", "..", 'data/sowprogEvents.json')).toString());
        const totalEvents = events.length + sites.length + activities.length + hiking.length + products.length + swpEvents.length;
        (0, logsLib_1.logGlobalStats)("appVisit");
        (0, logsLib_1.uniqueAppVisit)(userIp);
        return rep.code(200).send(totalEvents);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getTotalEvents = getTotalEvents;
async function getAllEvents(req, rep) {
    const email = req.params.email;
    const user = await users_1.default.findOne({ email: email });
    if (user?.admin === true) {
        const events = await events_1.default.find({});
        return rep.code(200).send(events);
    }
    else {
        return rep.code(403).send("Vous n'avez les droits");
    }
}
exports.getAllEvents = getAllEvents;
async function getAdsEvents(req, rep) {
    const events = await events_1.default.find({ isAds: true });
    return rep.code(200).send(events);
}
exports.getAdsEvents = getAdsEvents;
async function getUserEvents(req, rep) {
    const userMail = req.params.email;
    const user = await users_1.default.findOne({ email: userMail });
    if (!user) {
        return rep.code(404).send({ message: `User with email ${userMail} not found` });
    }
    const events = await events_1.default.find({ author: user.email });
    return rep.code(200).send(events);
}
exports.getUserEvents = getUserEvents;
async function createEvent(req, rep) {
    try {
        let eventFile;
        if (req.file)
            eventFile = req.file;
        const event = req.body;
        const newId = (0, uuid_1.v4)();
        await events_1.default.create({
            identifier: newId,
            themes: event.themes,
            tags: event.tags,
            author: event.author,
            isAds: event.isAds,
            areaDiff: '',
            banner: event.banner,
            eventNameFr: event.title,
            //eventNameFr:  event.isAds === 'true' ? `ads - ${event.title}` : event.title ,
            eventFile: eventFile ? eventFile.filename : "",
            videoLink: event.videoLink,
            addresses: event.addresses,
            city: event.city,
            zip: event.zip,
            lat: event.lat,
            lng: event.lng,
            startDate: event.startDate,
            endDate: event.endDate,
            startDiff: "",
            endDiff: "",
            startTime: event.startTime,
            endTime: event.endTime,
            creationDate: (0, moment_1.default)().format(),
            descriptionFr: event.descriptionFr,
            conditionsFr: event.conditionsFr,
            web: event.web,
            tels: event.tels,
            price: event.price,
            minPrice: event.minPrice,
            maxPrice: event.maxPrice,
            status: event.status,
            active: event.active,
            pending: true,
        });
        (0, logsLib_1.logGlobalStats)("eventLog", newId);
        if (event.isAds === true) {
            (0, data_services_1.p2bAdsEventsArray)();
        }
        else {
            (0, data_services_1.p2bFreeEventsArray)();
        }
        rep.code(201).send({ message: 'Event succesfully added', identifier: newId });
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.createEvent = createEvent;
async function getEventDetails(req, rep) {
    try {
        const eventIdentifier = req.params.identifier;
        const event = await events_1.default.findOne({ identifier: eventIdentifier });
        rep.code(200).send(event);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getEventDetails = getEventDetails;
async function getPendingEvents(req, rep) {
    try {
        const userMail = req.params.email;
        const user = await users_1.default.findOne({ email: userMail });
        if (user.admin === false) {
            rep.code(401).send({ message: "Accès non autorisé" });
        }
        const events = await events_1.default.find({ pending: true });
        rep.code(200).send(events);
    }
    catch (e) {
        console.error(e);
    }
}
exports.getPendingEvents = getPendingEvents;
async function updateEvent(req, rep) {
    try {
        const eventId = req.params.id;
        const file = req.file;
        const eventToUpdate = req.file ? { ...req.body, eventFile: file.filename } : { ...req.body };
        const event = await events_1.default.findOne({ identifier: eventId });
        if (file && (event?.eventFile !== eventToUpdate.eventFile && event?.eventFile !== eventToUpdate.file)) {
            fs_1.default.unlink(path_1.default.join(__dirname, '../../uploads/events/' + event?.eventFile), err => {
                if (err)
                    throw err;
            });
        }
        await events_1.default.findOneAndUpdate({ identifier: eventId }, eventToUpdate, { new: true }).then(() => {
            if (event.isAds === true) {
                console.log(event);
                (0, data_services_1.p2bAdsEventsArray)();
            }
            else {
                (0, data_services_1.p2bFreeEventsArray)();
            }
        });
        rep.code(201).send("event successfully update");
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.updateEvent = updateEvent;
async function getEventImg(req, rep) {
    const fileName = req.params.filename;
    rep.sendFile(`/events/${fileName}`);
}
exports.getEventImg = getEventImg;
async function deleteEvent(req, rep) {
    try {
        const eventRequestId = req.params.id;
        const event = await events_1.default.findOne({ _id: eventRequestId });
        if (event?.eventFile) {
            fs_1.default.unlink(path_1.default.join(__dirname, '..', '..', 'uploads/events/' + event?.eventFile), err => {
                if (err)
                    throw err;
            });
        }
        await events_1.default.deleteOne({ _id: eventRequestId });
        rep.code(200).send('Événement supprimé avec succès');
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.deleteEvent = deleteEvent;
async function sendEventMailIssue(req, rep) {
    const bodyRequest = req.body;
    console.log(bodyRequest);
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.MAIL_HOSTNAME,
        port: 587,
        secure: false,
        logger: true,
        debug: true,
        tls: { rejectUnauthorized: true },
        requireTLS: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.PWD_MAIL
        },
    });
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: bodyRequest,
        subject: "Conformité de votre annonce",
        html: `
        Bonjour,<br/>

        Votre annonce n'est pas conforme, elle ne peut être mise en ligne.<br/>
        
        Dans l'attente de votre modification<br/>
        
        Excellente journée à vous \uD83D\uDE0A <br/>
        	
        L'équipe Place2Be
        `,
        encoding: 'utf-8',
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("mail send" + info.response);
        }
    });
}
exports.sendEventMailIssue = sendEventMailIssue;
async function saveInvoiceEvent(req, rep) {
    const corInvoice = req.body;
    const eventInvoice = await events_1.default.findOne({ identifier: corInvoice.eventId });
    // Trouver la facture avec le numéro le plus élevé
    const lastInvoice = await invoices_1.default.findOne().sort('-invoiceNbre');
    let newNbre;
    if (lastInvoice) {
        let lastNbre = parseInt(lastInvoice.invoiceNbre.split('-')[2]);
        newNbre = lastNbre + 1;
    }
    else {
        newNbre = 1;
    }
    // Formatage du nouveau numéro de facture
    let formattedNbre = "P2B-FC-" + String(newNbre).padStart(4, '0');
    const newInvoice = new invoices_1.default({
        invoiceNbre: formattedNbre,
        userMail: eventInvoice.author,
        eventIdentifier: corInvoice.eventId,
        amountOrderWT: corInvoice.amount,
        invoiceObject: eventInvoice.eventNameFr,
        orderDate: corInvoice.orderDate
    });
    await newInvoice.save();
    return rep.send(newInvoice);
}
exports.saveInvoiceEvent = saveInvoiceEvent;
async function getUserInvoices(req, rep) {
    const reqMail = req.params.email;
    const userInvoices = await invoices_1.default.find({ userMail: reqMail });
    return rep.code(200).send(userInvoices);
}
exports.getUserInvoices = getUserInvoices;
