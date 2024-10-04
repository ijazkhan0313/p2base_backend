"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_controllers_1 = require("../controllers/users.controllers");
const crudEvents_controller_1 = require("../controllers/crudEvents.controller");
async function userRoutes(router) {
    router.post('/p2base/signup', users_controllers_1.signup);
    router.get('/p2base/account-validation', users_controllers_1.validateAccount);
    router.get('/p2base/validation/:usermail', users_controllers_1.checkValidity);
    router.get('/p2base/favorits/:id', users_controllers_1.favoritUserEvents);
    router.post('/p2base/login', users_controllers_1.login);
    router.post('/p2base/reset-pwd', users_controllers_1.resetPwdReq);
    router.get('/p2base/user/infos/:email', users_controllers_1.getUserDetails);
    router.get('/p2base/admin/pro/:email', users_controllers_1.getProUsers);
    router.get('/p2base/admin/mob/:email', users_controllers_1.getMobUsers);
    router.patch('/p2base/user/:id', users_controllers_1.udpateUser);
    router.patch('/p2base/user/reset-password', users_controllers_1.resetPassword);
    router.patch('/p2base/user/:id/dislike', users_controllers_1.dislikeEventAndRemoved);
    router.delete('/p2base/users/:id', users_controllers_1.deleteUser);
    router.get('/p2base/user/invoices/:email', crudEvents_controller_1.getUserInvoices);
    router.get('/p2base/code-checking', users_controllers_1.checkPwdCode);
}
module.exports = userRoutes;
