"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (schemas) => (req, res, next) => {
    const issues = [];
    const parse = (part, schema) => {
        if (!schema)
            return;
        const parsed = schema.safeParse(req[part]);
        if (!parsed.success) {
            parsed.error.issues.forEach((i) => issues.push({ path: i.path.join('.'), message: i.message, in: part }));
        }
        else {
            req[part] = parsed.data;
        }
    };
    parse('params', schemas.params);
    parse('query', schemas.query);
    parse('body', schemas.body);
    if (issues.length) {
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
    next();
};
exports.validateRequest = validateRequest;
