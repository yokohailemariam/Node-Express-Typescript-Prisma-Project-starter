"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = httpLogger;
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("@/common/utils/logger");
morgan_1.default.token('id', (_req, res) => res.locals.requestId);
function httpLogger() {
    const format = ':method :url :status :res[content-length] - :response-time ms trace=:id agent=":user-agent"';
    return (0, morgan_1.default)(format, {
        stream: {
            write: (message) => logger_1.logger.info(message.trim()),
        },
    });
}
