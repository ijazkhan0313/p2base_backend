"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPwdCode = exports.resetPassword = exports.resetPwdReq = exports.deleteUser = exports.dislikeEventAndRemoved = exports.favoritUserEvents = exports.udpateUser = exports.getUserDetails = exports.getMobUsers = exports.getProUsers = exports.checkValidity = exports.login = exports.validateAccount = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = __importDefault(require("../models/users"));
const tokens_1 = __importDefault(require("../models/tokens"));
const __1 = require("../../");
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const node_path_1 = __importDefault(require("node:path"));
const events_1 = __importDefault(require("../models/events"));
const logsLib_1 = require("../utils/logsLib");
async function signup(req, rep) {
    try {
        const bodyRequest = JSON.parse(req.body);
        let user = await users_1.default.findOne({ email: bodyRequest.email });
        if (user) {
            return rep.code(400).send('user already exist');
        }
        else {
            bcrypt_1.default.hash(bodyRequest.password, 10, async (error, hash) => {
                if (error) {
                    rep.code(500).send(error);
                    return;
                }
                user = new users_1.default({
                    diffuser: bodyRequest.diffuser ?? false,
                    advertiser: bodyRequest.advertiser ?? false,
                    email: bodyRequest.email,
                    password: hash,
                    phoneNumber: bodyRequest.phoneNumber,
                    brandName: bodyRequest.brandName ?? "",
                    isAssociation: bodyRequest.isAssociation ?? false,
                    isEntreprise: bodyRequest.isEntreprise ?? false,
                    streetAddress: bodyRequest.adress ?? "",
                    city: bodyRequest.city ?? "",
                    zipCode: bodyRequest.zipCode ?? "",
                    siret: bodyRequest.siret ?? "",
                    webSite: bodyRequest.webSite ?? "",
                    platform: bodyRequest.platform ?? "WEB",
                });
                await user.save();
                const activationCode = Math.floor(100000 + Math.random() * 900000); //generate temporary token for validation
                const temporaryToken = __1.server.jwt.sign({ userId: user._id, token: crypto_1.default.randomBytes(16).toString('hex') });
                let mailObj = '';
                let link = "";
                if (bodyRequest.platform === "WEB") {
                    await tokens_1.default.create({
                        token: temporaryToken,
                        userMail: bodyRequest.email,
                        platform: bodyRequest.platform ?? "WEB"
                    });
                    if (bodyRequest.diffuser === "true") {
                        (0, logsLib_1.logGlobalStats)('difLog', user._id.toString());
                    }
                    else {
                        (0, logsLib_1.logGlobalStats)('advLog', user._id.toString());
                    }
                    link = `${process.env.API_URL}account-validation?token=${temporaryToken}`;
                    mailObj = `
                  Bonjour et bienvenue, </br>
                  Cliquer sur le lien ci-dessous pour activer votre compte.  </br>
                  <a href="${link}">http://localhost:5173/activation-de-compte</a>  </br>
                  À tout de suite ! </br>
                  Place2be
                `;
                }
                else {
                    (0, logsLib_1.logGlobalStats)("mobileLog", user._id.toString());
                    await tokens_1.default.create({
                        token: temporaryToken,
                        userMail: bodyRequest.email,
                        mobileCode: activationCode,
                        platform: bodyRequest.platform ?? "MOBILE"
                    });
                    mailObj = `
                  Bonjour et bienvenue, </br>
                  Voici votre code d'activation: ${activationCode} </br>
                  À tout de suite ! </br>
                  Place2be
                `;
                }
                const transporter = nodemailer_1.default.createTransport({
                    host: process.env.MAIL_HOSTNAME,
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.PWD_MAIL
                    },
                });
                const mailOptions = {
                    from: process.env.MAIL_USER,
                    to: bodyRequest.email,
                    subject: "Activation de votre compte Place2Be",
                    html: mailObj
                };
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("mail send" + info.response);
                    }
                });
            });
        }
    }
    catch (error) {
        rep.code(500).send(error);
    }
}
exports.signup = signup;
;
async function validateAccount(req, rep) {
    const tmpToken = req.query.token;
    const userCode = req.query.code;
    let userAccount;
    if (tmpToken) {
        userAccount = await tokens_1.default.findOne({ token: tmpToken });
    }
    else {
        userAccount = await tokens_1.default.findOne({ mobileCode: userCode });
    }
    if (!userAccount) {
        return rep.code(401).send('No account to validate found');
    }
    else {
        try {
            const userMail = userAccount.userMail;
            const valitadeUser = { validUser: true };
            const user = users_1.default.findOne({ email: userMail });
            if (userAccount.platform === 'MOBILE') {
                if (user.validUser === true) {
                    return rep.code(400).send('Account already validated');
                }
                else {
                    await users_1.default.findOneAndUpdate({ email: userMail }, valitadeUser);
                    await tokens_1.default.deleteOne({ mobileCode: userCode });
                    return rep.code(200).send('success activation');
                }
            }
            if (userAccount.platform === "WEB") {
                if (user.validUser === true) {
                    return rep.code(400).send('Account already validated');
                }
                else {
                    await users_1.default.findOneAndUpdate({ email: userMail }, valitadeUser);
                    rep.redirect("https://www.place2be.fr/");
                    await tokens_1.default.deleteOne({ token: tmpToken });
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.validateAccount = validateAccount;
async function login(req, rep) {
    try {
        const bodyRequest = JSON.parse(req.body);
        const user = await users_1.default.findOne({ email: bodyRequest.email });
        if (!user)
            return rep.code(404).send('Aucun utilisateur avec cet email trouvé');
        const isValid = await bcrypt_1.default.compare(bodyRequest.password, user.password);
        if (!isValid) {
            return rep.code(406).send('mot de passe invalide');
        }
        const token = __1.server.jwt.sign({ token: process.env.JWT_SECRET });
        rep.code(202).send({ message: 'Utilisateur connecté', data: user, token });
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.login = login;
async function checkValidity(req, rep) {
    try {
        const validUserEmail = req.params.usermail;
        const user = await users_1.default.findOne({ email: validUserEmail });
        if (!user) {
            return rep.code(403).send('Aucun utilisateur trouvé, accès interdit');
        }
        else {
            const isValid = user.validUser;
            const token = __1.server.jwt.sign({ token: process.env.JWT_SECRET });
            rep.code(201).send({ token: token, validUser: isValid });
        }
    }
    catch (err) {
        console.error(err);
    }
}
exports.checkValidity = checkValidity;
async function getProUsers(req, rep) {
    try {
        const userMail = req.params.email;
        const user = await users_1.default.findOne({ email: userMail });
        if (user.admin === false)
            return rep.code(401).send('Accès non autorisé');
        const users = await users_1.default.find({ $or: [{ advertiser: true }, { diffuser: true }] });
        return rep.code(200).send(users);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getProUsers = getProUsers;
;
async function getMobUsers(req, rep) {
    try {
        const userMail = req.params.email;
        const user = await users_1.default.findOne({ email: userMail });
        if (user.admin === false)
            return rep.code(401).send('Accès non autorisé');
        const users = await users_1.default.find({ diffuser: false, advertiser: false });
        return rep.code(200).send(users);
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getMobUsers = getMobUsers;
;
async function getUserDetails(req, rep) {
    try {
        // let userAllowed = req.body.superAdmin; 
        const userEmail = req.params.email;
        //const userRequestId = req.params.id
        //if (userId === userRequestId) userAllowed = true;
        //if(!userAllowed)return rep.code(401).send('Accès non autorisé')
        const user = await users_1.default.findOne({ email: userEmail });
        return rep.code(200).send({ user });
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.getUserDetails = getUserDetails;
;
async function udpateUser(req, rep) {
    try {
        const bodyRequest = JSON.parse(req.body);
        const userRequestId = new mongoose_1.default.Types.ObjectId(req.params.id);
        const userToUpdate = bodyRequest;
        if (bodyRequest.identifier) {
            await users_1.default.findOneAndUpdate({ _id: userRequestId }, { $push: { favoritesEvents: userToUpdate.identifier } });
        }
        else {
            await users_1.default.findOneAndUpdate({ _id: userRequestId }, userToUpdate);
        }
        // if (userId === userRequestId) userAllowed = true;
        // if(!userAllowed)return rep.code(401).send('Accès non autorisé')
        rep.code(200).send({ message: 'Successfully updated' });
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.udpateUser = udpateUser;
;
async function favoritUserEvents(req, rep) {
    const favorits = [];
    const userRequestId = new mongoose_1.default.Types.ObjectId(req.params.id);
    const userData = await users_1.default.findOne({ _id: userRequestId });
    const favoriteArray = userData?.favoritesEvents;
    const dataTourismeEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/events.json')).toString());
    const hiking = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/hiking.json')).toString());
    const activities = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/activities.json')).toString());
    const sites = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/sites.json')).toString());
    const products = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/products.json')).toString());
    const swpEvents = JSON.parse(fs_1.default.readFileSync(node_path_1.default.join(__dirname, "..", "..", "..", 'data/sowprogEvents.json')).toString());
    const dbEvents = await events_1.default.find({});
    const events = dataTourismeEvents.concat(sites, dbEvents, hiking, activities, products, swpEvents);
    try {
        for await (const event of events) {
            for await (const favorit of favoriteArray) {
                if (event.identifier === favorit) {
                    if (!event.img)
                        event.img = "https://images.pexels.com/photos/7557532/pexels-photo-7557532.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&dpr=2";
                    favorits.push(event);
                }
            }
        }
        const favoritFilterEvents = favorits.filter((element, index, self) => index === self.findIndex((e) => (e.identifier === element.identifier)));
        return rep.code(200).send(favoritFilterEvents);
    }
    catch (error) {
        console.log(error);
    }
}
exports.favoritUserEvents = favoritUserEvents;
async function dislikeEventAndRemoved(req, rep) {
    const bodyRequest = JSON.parse(req.body);
    const userRequestId = new mongoose_1.default.Types.ObjectId(req.params.id);
    const userToUpdate = bodyRequest;
    const userData = await users_1.default.findOne({ _id: userRequestId });
    const favoriteArray = userData?.favoritesEvents;
    if (favoriteArray && favoriteArray.length > 0) {
        for (let i = 0; i < favoriteArray.length; i++) {
            const item = favoriteArray[i];
            if (userToUpdate.identifier === item) {
                await users_1.default.findOneAndUpdate({ _id: userRequestId }, { $pull: { favoritesEvents: item } });
            }
        }
    }
    rep.code(200).send("Event Successfully removed");
}
exports.dislikeEventAndRemoved = dislikeEventAndRemoved;
async function deleteUser(req, rep) {
    try {
        // let userAllowed = req.body.superAdmin; 
        // const userId = req.body.id
        const userRequestId = new mongoose_1.default.Types.ObjectId(req.params.id);
        // if (userId === userRequestId) userAllowed = true;
        // if(!userAllowed)return rep.code(401).send('Accès non autorisé')
        await users_1.default.findByIdAndDelete({ _id: userRequestId });
        rep.code(200).send('Successfully deleted');
    }
    catch (err) {
        rep.code(500).send(err);
    }
}
exports.deleteUser = deleteUser;
;
async function resetPwdReq(req, rep) {
    let bodyRequest;
    let link;
    let user;
    let mailObj;
    if (req.body.provide === "WEB") {
        bodyRequest = req.body;
        user = await users_1.default.findOne({ email: bodyRequest.email });
        const temporaryToken = __1.server.jwt.sign({ userId: user._id, token: crypto_1.default.randomBytes(16).toString('hex') });
        link = `http://localhost:5173/renouvellement-mdp?token=${temporaryToken}`;
        mailObj = `
    Bonjour et bienvenue,\n 
    Cliquer sur le lien ci-dessous pour renouveler votre mot de passe.\n

    <a href="${link}">https//place2be.fr/renouvellement-mdp</a>\n

    Si vous n'êtes pas à l'origine de cette action, merci de nous contacter par mail via\n
    contact@place2be.fr

    À tout de suite !\n
    Place2be
    `;
        await tokens_1.default.create({
            token: temporaryToken,
            userMail: bodyRequest.email
        });
        rep.code(201).send('Reset password send');
    }
    else {
        bodyRequest = JSON.parse(req.body);
        user = await users_1.default.findOne({ email: bodyRequest.email });
        const activationCode = Math.floor(100000 + Math.random() * 900000);
        mailObj = `
    Bonjour et bienvenue,\n 

    Voici votre code de renouvellement de mot de passe : ${activationCode} \n

    Si vous n'êtes pas à l'origine de cette action, merci de nous contacter par mail via\n
    contact@place2be.fr

    À tout de suite !\n
    Place2be
    `;
        await tokens_1.default.create({
            mobileCode: activationCode,
            userMail: bodyRequest.email
        });
        rep.code(201).send('Reset password send');
    }
    //Send verification AddEmailAccount
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
        to: bodyRequest.email,
        subject: "Renouvellement de votre mot de passe",
        html: mailObj
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
exports.resetPwdReq = resetPwdReq;
async function resetPassword(req, rep) {
    let bodyRequest = req.body.provide === "WEB" ? req.body : JSON.parse(req.body);
    const { token: tmpTkn, password: newPwd, code, provide } = bodyRequest;
    const filterCondition = provide === "WEB" ? { token: tmpTkn } : { mobileCode: code };
    const userTkn = await tokens_1.default.findOne(filterCondition);
    if (!userTkn) {
        return rep.code(401).send('No reset request found');
    }
    if (userTkn.mobileCode) {
        if (userTkn.mobileCode.toString() !== filterCondition.mobileCode) {
            return rep.code(403).send("No activation code relation find");
        }
        bcrypt_1.default.hash(newPwd, 10, async (error, hash) => {
            if (error) {
                rep.code(500).send(error);
                return;
            }
            try {
                const userMail = userTkn.userMail;
                await users_1.default.findOneAndUpdate({ email: userMail }, { password: hash });
                await tokens_1.default.deleteOne({ mobileCode: code });
                rep.code(201).send('password successfully reset');
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    if (filterCondition.token) {
        bcrypt_1.default.hash(newPwd, 10, async (error, hash) => {
            if (error) {
                rep.code(500).send(error);
                return;
            }
            try {
                const userMail = userTkn.userMail;
                await users_1.default.findOneAndUpdate({ email: userMail }, { password: hash });
                await tokens_1.default.deleteOne({ token: tmpTkn });
                rep.code(201).send('password successfully reset');
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.resetPassword = resetPassword;
async function checkPwdCode(req, rep) {
    const userCode = req.query.code;
    const userAccount = await tokens_1.default.findOne({ mobileCode: userCode });
    if (userAccount.mobileCode.toString() === userCode) {
        return rep.code(200).send("Code successfully found");
    }
    else {
        return rep.code(403).send("Wrong code");
    }
}
exports.checkPwdCode = checkPwdCode;
