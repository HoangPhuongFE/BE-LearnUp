"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPermission = void 0;
const checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        const user = req.user;
        console.log(user); // In ra thông tin user để kiểm tra role và permissions
        // Nếu là admin, bỏ qua kiểm tra quyền
        if ((user === null || user === void 0 ? void 0 : user.role) === 'admin') {
            console.log('Admin detected, skipping permission check');
            return next();
        }
        // Kiểm tra quyền của người dùng
        if ((user === null || user === void 0 ? void 0 : user.permissions) && user.permissions.includes(requiredPermission)) {
            return next();
        }
        else {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này' });
        }
    };
};
exports.checkPermission = checkPermission;
