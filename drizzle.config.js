import 'dotenv/config';

export default {
  // Only generate migrations for the users table (from the user model)
  schema: ['./src/models/user.model.js'],
  // Standard Drizzle output folder
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};