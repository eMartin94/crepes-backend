import dotenv from 'dotenv';
dotenv.config();

export const FRONTEND_URL_LOCAL = process.env.FRONTEND_URL_LOCAL;

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_ENDPOINT_SECRET;

export const GOOGLE_API_USER = process.env.GOOGLE_API_USER;
export const GOOGLE_API_CLIENT_ID = process.env.GOOGLE_API_CLIENT_ID;
export const GOOGLE_API_CLIENT_SECRET = process.env.GOOGLE_API_CLIENT_SECRET;
export const GOOGLE_API_REDIRECT_URIS = process.env.GOOGLE_API_REDIRECT_URIS;
export const GOOGLE_API_REFRESH_TOKEN = process.env.GOOGLE_API_REFRESH_TOKEN;
export const GOOGLE_API_PROJECT_ID = process.env.GOOGLE_API_PROJECT_ID;
export const GOOGLE_API_AUTH_URI = process.env.GOOGLE_API_AUTH_URI;
export const GOOGLE_API_TOKEN_URI = process.env.GOOGLE_API_TOKEN_URI;
export const GOOGLE_API_AUTH_PROVIDER = process.env.GOOGLE_API_AUTH_PROVIDER;
