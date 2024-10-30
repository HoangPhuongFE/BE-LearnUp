"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentLink = void 0;
const node_1 = __importDefault(require("@payos/node"));
require('dotenv').config();
const payOSClientId = process.env.PAYOS_CLIENT_ID || '';
const payOSApiKey = process.env.PAYOS_API_KEY || '';
const payOSChecksumKey = process.env.PAYOS_CHECKSUM_KEY || '';
if (!payOSClientId || !payOSApiKey || !payOSChecksumKey) {
    throw new Error("Missing PayOS configuration. Please check .env file.");
}
const payOS = new node_1.default(payOSClientId, payOSApiKey, payOSChecksumKey);
const createPaymentLink = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield payOS.createPaymentLink(paymentData);
    }
    catch (error) {
        console.error("Error creating payment link:", error);
        throw error;
    }
});
exports.createPaymentLink = createPaymentLink;
