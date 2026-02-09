import "dotenv/config";
import { Sequelize } from "sequelize";

const sslEnabled = String(process.env.DB_SSL).toLowerCase() === "true";

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        dialect: "mysql",
        logging: false,

        dialectOptions: sslEnabled
            ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false,
                },
            }
            : undefined,
    }
);

export async function connectSequelize() {
    await sequelize.authenticate();
    console.log("✅ MySQL connected (Sequelize)");
}
