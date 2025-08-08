"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestId = requestId;
const crypto_1 = require("crypto");
function requestId() {
    return (req, res, next) => {
        const id = req.headers['x-request-id'] || (0, crypto_1.randomUUID)();
        res.setHeader('X-Request-Id', id);
        res.locals.requestId = id;
        next();
    };
}
