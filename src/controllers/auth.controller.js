import logger from "#config/logger";
import { createUser } from "#services/auth.service";
import { cookies } from "#utils/cookies";
import { formatValidationError } from "#utils/format";
import { jwttoken } from "#utils/jwt";
import { signUpSchema } from "../validations/auth.validation.js";

export const signup = async (req, resizeBy, next) => {
    try{
        const validationResult = signUpSchema.safeParse(req.body);

        if(!validationResult.success){
            return resizeBy.status(400).json({
                error: 'validation failed',
                details: formatValidationError(validationResult.error)
            });
        }

        const { name, email, password, role } = validationResult.data;

        //auth service
        const user = await createUser({
            name, email, password, role
        });

        const token = jwttoken.sign({id: user.id, email: user.email, role: user.role});

        cookies.set(resizeBy,'token', token);

        logger.info(`User registered successfully: ${email}`);
        resizeBy.status(201).json({
            message: 'User registered',
            user:{
                id: user.id, name: user.name , email : user.email, role :user.role
            }
        })
    }catch (e){
        logger.error('Signup error', e);

        if(e.message === 'User with this email already exists'){
            return resizeBy.status(409).json({error: 'User with this email already exists'});
        }
        next(e);
    }
};