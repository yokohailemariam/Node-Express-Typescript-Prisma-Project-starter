"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ctrl = __importStar(require("./controller"));
const validate_1 = require("@/common/middlewares/validate");
const schema_1 = require("./schema");
const validateRequest_1 = require("@/common/middlewares/validateRequest");
const rateLimit_1 = require("@/common/middlewares/rateLimit");
const router = (0, express_1.Router)();
router.get('/', (0, validateRequest_1.validateRequest)({ query: schema_1.listUsersQuerySchema }), ctrl.list);
router.get('/:id', (0, validateRequest_1.validateRequest)({ params: schema_1.idParamSchema }), ctrl.get);
router.post('/', rateLimit_1.sensitiveLimiter, (0, validate_1.validate)(schema_1.createUserSchema), ctrl.create);
router.patch('/:id', rateLimit_1.sensitiveLimiter, (0, validateRequest_1.validateRequest)({ params: schema_1.idParamSchema }), (0, validate_1.validate)(schema_1.updateUserSchema), ctrl.update);
router.delete('/:id', rateLimit_1.sensitiveLimiter, (0, validateRequest_1.validateRequest)({ params: schema_1.idParamSchema }), ctrl.remove);
exports.default = router;
