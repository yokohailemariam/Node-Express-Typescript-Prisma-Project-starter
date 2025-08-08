"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpRequestDuration = exports.register = void 0;
exports.metricsMiddleware = metricsMiddleware;
const prom_client_1 = __importDefault(require("prom-client"));
exports.register = new prom_client_1.default.Registry();
prom_client_1.default.collectDefaultMetrics({ register: exports.register });
exports.httpRequestDuration = new prom_client_1.default.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'status'],
    buckets: [50, 100, 200, 300, 500, 1000, 2000, 5000],
});
exports.register.registerMetric(exports.httpRequestDuration);
function metricsMiddleware() {
    return async (_req, res) => {
        res.set('Content-Type', exports.register.contentType);
        res.end(await exports.register.metrics());
    };
}
