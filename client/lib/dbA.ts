import pg from "pg";

// Singleton pattern for the database connection
const createDbClient = () => {
  return new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "PANSIAM",
    password: process.env.DB_PASSWORD,
    port: 5432,
  });
};

// Declare the globalThis object to hold the singleton instance
declare const globalThis: {
  dbGlobal: ReturnType<typeof createDbClient>;
} & typeof global;

const db = globalThis.dbGlobal ?? createDbClient();

// Ensure the client is connected
if (!globalThis.dbGlobal) {
  db.connect().catch((err) => console.error("Database connection error:", err));
  if (process.env.NODE_ENV !== 'production') globalThis.dbGlobal = db;
}

export default db;
