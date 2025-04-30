// PostgreSQL DB Connection
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: "postgresql://postgres:user123@localhost:5432/userdb",
//   connectionString: process.env.DATABASE_URL,
});

export default pool;
