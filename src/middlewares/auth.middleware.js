import User from '../../DataBase/models/user.model.js';
import AppError from '../../utils/appError.js';
const hasRole = (...role) => {
return (req, res, next) => {
    if(!req.user){
        return next(new AppError('User not found', 404));
    }
    if(!role.includes(req.user.role)){
        return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
}
}

export const isAdmin = hasRole('admin');
export const isUser = hasRole('user');
export const isSeller = hasRole('seller');
export const isAdminOrUser = hasRole('admin', 'user');
export const isAdminOrSeller = hasRole('admin', 'seller');
export const isUserOrSeller = hasRole('user', 'seller');