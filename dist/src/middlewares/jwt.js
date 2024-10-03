"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const __1 = require("../..");
function verifyToken(req, rep, next) {
    try {
        const jwtToken = req.headers.authorization;
        const tokenArray = jwtToken.split(" ");
        __1.server.jwt.verify(tokenArray[1]);
        next();
    }
    catch (e) {
        rep.code(403).send();
    }
}
exports.verifyToken = verifyToken;
