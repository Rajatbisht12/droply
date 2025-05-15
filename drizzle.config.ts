import * as dotenv from "dotenv";
import type { Config } from 'drizzle-kit';

dotenv.config({path : ".env.local"})

if(!process.env.DATABASE_URL){
    throw new Error("No URL")
}

export default {
    schema: './lib/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    migrations: {
        table: "__drizzle_migrations",
        schema: "public"
    },
    verbose: true,
    strict: true
} satisfies Config;