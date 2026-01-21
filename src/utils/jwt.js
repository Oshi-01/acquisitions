import logger from '#config/logger';
import jwt from 'jsonwebtoken';

 const JWT_SECRET = process.env.JWT_SECRET || 'your-secreate-key-please-chnage-in-production';
 const JWT_EXPIRATION_IN = '1d';

 export const jwttoken = {
    sign: (payload) =>{
        try{
            return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION_IN});
        }catch (e){
            logger.error('failed to autheticate token', e);
            throw new Error('Fialed to authenticate token');
        }
    },
    verify: (token) => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            logger.error('failed to verify token', error);
            throw new Error('Failed to verify token');
        }
    }
 };