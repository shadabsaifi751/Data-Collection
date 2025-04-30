## User Data Collection and API System

### Features
- Cron job fetches 5 users every 5 minutes from the RandomUser API
- Stores users and their location in PostgreSQL (`users` and `locations` tables)
- REST API with support for:
  - Filtering by gender, city, and country
  - Pagination
  - Field selection
- UI to search, filter, and paginate users
- Code includes clean and clear comments for better understanding

### Tech Stack
- Next.js
- PostgreSQL
- Node-Cron
- Axios
- Lodash Debounce
- swr

# PostgreSQL connection string
DATABASE_URL=postgresql://your_db_user:your_db_password@localhost:5432/your_db_name

### Create PostgreSQL Tables

```sql
-- User Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  gender VARCHAR(50),
  location_id INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Location Table
CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  city VARCHAR(255),
  country VARCHAR(255)
);


### How to Run
1. Setup `.env` with PostgreSQL URL
2. Create tables using given SQL
3. Run `node utils/cronJob.js`
4. Start app with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

### API Example:
`/api/users?gender=male&country=Germany&page=2&limit=5&fields=name,email`
