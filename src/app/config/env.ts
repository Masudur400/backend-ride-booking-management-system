import dotenv from 'dotenv'

dotenv.config()

interface EnvConfig {
    PORT: string
    DB_URL: string
    NODE_ENV: 'development' | 'production'
    BCRYPT_SALT_ROUND: string
    JWT_ACCESS_SECRET: string
    JWT_ACCESS_EXPIRES: string
    JWT_REFRESH_SECRET: string
    JWT_REFRESH_EXPIRES: string
    EXPRESS_SESSION_SECRET: string
    FRONTEND_URL: string
    SUPER_ADMIN: {
        SUPER_ADMIN_EMAIL: string
        SUPER_ADMIN_PASSWORD: string
    }
    EMAIL_SENDER: {
        SMTP_HOST: string
        SMTP_PORT: string
        SMTP_USER: string
        SMTP_PASS: string
        SMTP_FROM: string
    }
    GOOGLE_CREDENTIAL: {
        GOOGLE_CLIENT_ID: string,
        GOOGLE_CLIENT_SECRET: string,
        GOOGLE_CALLBACK_URL: string
    }
}

const loadEnvVariables = (): EnvConfig => {

    const requiredEnvVariables: string[] = ["PORT", "DB_URL", "NODE_ENV", "BCRYPT_SALT_ROUND", "JWT_ACCESS_SECRET", "JWT_ACCESS_EXPIRES", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRES", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_CALLBACK_URL", "EXPRESS_SESSION_SECRET", "FRONTEND_URL", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD"]

    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`missing require env variable ${key}`)
        }
    })
    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
        FRONTEND_URL: process.env.FRONTEND_URL as string,
        SUPER_ADMIN: {
            SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
            SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string
        },
        EMAIL_SENDER: {
            SMTP_HOST: process.env.SMTP_HOST as string,
            SMTP_PORT: process.env.SMTP_PORT as string,
            SMTP_USER: process.env.SMTP_USER as string,
            SMTP_PASS: process.env.SMTP_PASS as string,
            SMTP_FROM: process.env.SMTP_FROM as string,
        },
        GOOGLE_CREDENTIAL: {
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
            GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string
        }
    }
}


export const envVars: EnvConfig = loadEnvVariables()