import { config } from "dotenv";
config();

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const PASSWORD_SALT = 10;