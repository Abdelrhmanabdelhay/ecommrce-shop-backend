import joi from 'joi';
import AppError from '../../../utils/appError.js';
// Authentication schema for validation
// Using Joi for schema validation
const loginschema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(20).required(),
});
const signupschema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(20).required(),
    name: joi.string().min(3).max(30).required(),
    role: joi.string().valid('user', 'admin', 'seller').optional() // ✅ allow role

});

const validateLogin = (req,res,next)=>{
    const { error } = loginschema.validate(req.body);
    if (error) {
        return next(new AppError(error.message, 400,error.details));
    }
    next();
}
const validateSignup = (req,res,next)=>{
    const { error } = signupschema.validate(req.body);
    if (error) {
        return next(new AppError(error.message, 400,error.details));
    }
    next();
}
export { validateLogin, validateSignup,};