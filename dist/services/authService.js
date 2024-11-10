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
exports.getUserByIdService = exports.updateUserService = exports.resetUserPassword = exports.createResetPasswordToken = exports.loginUser = exports.createUser = exports.findUserByEmail = void 0;
// services/authService.ts
const User_1 = __importDefault(require("../models/User"));
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.default.findOne({ email });
});
exports.findUserByEmail = findUserByEmail;
const createUser = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield (0, exports.findUserByEmail)(email);
    if (userExists) {
        throw new Error('User already exists');
    }
    const user = new User_1.default({
        name,
        email,
        password,
    });
    yield user.save();
    return user;
});
exports.createUser = createUser;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }
    return user;
});
exports.loginUser = loginUser;
const createResetPasswordToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const resetToken = crypto_1.default.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token hết hạn sau 10 phút
    yield user.save();
    return resetToken;
});
exports.createResetPasswordToken = createResetPasswordToken;
const resetUserPassword = (user, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt(10);
    user.password = yield bcrypt_1.default.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    yield user.save();
});
exports.resetUserPassword = resetUserPassword;
const updateUserService = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield User_1.default.findByIdAndUpdate(userId, data, { new: true });
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    }
    catch (error) {
        throw new Error('Error updating user');
    }
});
exports.updateUserService = updateUserService;
const getUserByIdService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    catch (error) {
        throw new Error('Error retrieving user');
    }
});
exports.getUserByIdService = getUserByIdService;
