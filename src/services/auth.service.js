import logger from "#config/logger";
import { db } from "#config/database";
import { users } from "#models/user.model";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt';


 export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (e) {
        logger.error(`Error hasing the password: ${e}`);
        throw new Error('Error hasing ');
    }
 }

 export const createUser = async({name, email, password, role = 'user'}) => {
    try{
        const existingUser = await db.select().from(users).where(eq(users.email, email));

        if(existingUser.length > 0) throw new Error('User with this email already exists');

        const password_hash = await hashPassword(password);

        const [newUser] = await db
        .insert(users)
        .values({name, email, password: password_hash, role})
        .returning();
        
        if(!newUser){
            throw new Error('Failed to create user - no data returned');
        }
        
        logger.info(`User ${newUser.email} created successfully`);
        return newUser;
    }catch (e){
        logger.error(`Error creating user: ${e.message || e}`);
        // If it's already our custom error, re-throw it
        if(e.message === 'User with this email already exists'){
            throw e;
        }
        // Otherwise throw with original error message
        throw new Error(`Error creating user: ${e.message || e}`);
    }
 }