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
// models/User.ts
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'staff', 'member_free', 'member_premium'],
        default: 'member_free',
    },
    permissions: {
        type: [String],
        default: [],
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
    avatar: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'orther'],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    premiumStartDate: {
        type: Date,
        default: null,
    },
    premiumEndDate: {
        type: Date,
        default: null,
    },
    birthDate: {
        type: Date,
    },
    about: {
        type: String,
    },
});
// Mã hóa mật khẩu trước khi lưu vào DB
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            return next();
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        this.password = yield bcrypt_1.default.hash(this.password, salt);
        next();
    });
});
// So sánh mật khẩu
userSchema.methods.matchPassword = function (enteredPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(enteredPassword, this.password);
    });
};
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
