"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.audit = audit;
const logger_1 = require("./logger");
function audit(event) {
    logger_1.logger.info('audit', event);
}
