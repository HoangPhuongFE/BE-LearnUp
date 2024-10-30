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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.createOrder = void 0;
const orderService_1 = require("../services/orderService");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { product } = req.body;
    const user = req.user;
    try {
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const order = yield (0, orderService_1.createOrderService)(user._id.toString(), product);
        res.status(201).json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Không thể tạo đơn hàng', error: error.message });
    }
});
exports.createOrder = createOrder;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId, status } = req.body;
    try {
        const order = yield (0, orderService_1.updateOrderStatusService)(orderId, status);
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Không thể cập nhật trạng thái đơn hàng', error: error.message });
    }
});
exports.updateOrderStatus = updateOrderStatus;
