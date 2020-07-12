import path from "path";
import { config } from "dotenv";
config();

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const PASSWORD_SALT = 10;

export const IMAGES_URL = path.join(__dirname, "../../public/img");

export const DOMAIN = process.env.DOMAIN;