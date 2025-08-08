"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.created = created;
function withTrace(res, body) {
    return { traceId: res.locals.requestId, ...body };
}
function ok(res, data, meta) {
    return res.json(withTrace(res, { data, ...(meta ? { meta } : {}) }));
}
function created(res, data, meta) {
    return res.status(201).json(withTrace(res, { data, ...(meta ? { meta } : {}) }));
}
