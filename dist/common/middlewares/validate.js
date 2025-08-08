"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
        const issues = parsed.error.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
            code: i.code,
        }));
        return res.status(400).json({
            type: 'https://datatracker.ietf.org/doc/html/rfc7807',
            title: 'Bad Request',
            status: 400,
            detail: 'Validation failed',
            instance: req.originalUrl,
            traceId: res.locals.requestId,
            errors: issues,
        });
    }
    req.body = parsed.data;
    next();
};
exports.validate = validate;
