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
exports.updateOrderStatusService = exports.createOrderService = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
const pricing_1 = require("../config/pricing");
const createOrderService = (userId, product) => __awaiter(void 0, void 0, void 0, function* () {
    const amount = pricing_1.pricing[product];
    if (!amount) {
        throw new Error('Sản phẩm không tồn tại');
    }
    const order = new Order_1.default({
        user: userId,
        product,
        amount,
        status: 'pending',
    });
    yield order.save();
    return order;
});
exports.createOrderService = createOrderService;
const updateOrderStatusService = (orderId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield Order_1.default.findById(orderId);
    if (!order) {
        throw new Error('Đơn hàng không tồn tại.');
    }
    // Nếu đơn hàng đã bị hủy, không thể cập nhật lại trạng thái
    if (order.status === 'cancelled') {
        throw new Error('Đơn hàng này đã bị hủy, không thể cập nhật trạng thái.');
    }
    // Cập nhật trạng thái đơn hàng
    order.status = status;
    // Nếu đơn hàng được hoàn thành, nâng cấp tài khoản người dùng lên member_premium
    if (status === 'completed') {
        const user = yield User_1.default.findById(order.user);
        if (user) {
            user.role = 'member_premium';
            user.premiumStartDate = new Date();
            user.premiumEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Thêm 30 ngày
            yield user.save();
        }
    }
    yield order.save();
    return order;
});
exports.updateOrderStatusService = updateOrderStatusService;
