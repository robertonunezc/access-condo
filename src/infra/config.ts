import dotenv from "dotenv";

// Load .env file only in non-production environments
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

export const config = {
    redisHost: process.env.REDIS_HOST || "localhost",
    redisPort: Number(process.env.REDIS_PORT) || 6379,
    dbHost: process.env.DATABASE_HOST || "localhost",
    dbPort: Number(process.env.DATABASE_PORT) || 5432,
    dbUser: process.env.DATABASE_USER || "user",
    dbPassword: process.env.DATABASE_PASSWORD || "password",
    dbName: process.env.DATABASE_NAME || "app_db",
    awsRegion: process.env.AWS_REGION || "us-east-1",
    awsAccessKeyId: process.env.AWS_ACCESS_KEY || "default",
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "default",
    awsBucketName: process.env.AWS_BUCKET_NAME || "default",
    queueUrl: process.env.QUEUE_URL || "http://localhost:9324/queue/default",
    mailgunApiKey: process.env.MAILGUN_API_KEY || "default",
    mailgunDomain: process.env.MAILGUN_DOMAIN || "default",
    jwtSecret: process.env.JWT_SECRET || "default",
    webHost: process.env.WEB_HOST || "http://localhost:3000",
    appPort: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || "development",

};
