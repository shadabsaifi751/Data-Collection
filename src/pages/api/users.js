import db from "../../utils/db.js";

export default async function handler(req, res) {
  const { gender, city, country, search, fields, page = 1, limit = 10 } = req.query;

  let baseQuery = `
    SELECT users.id, users.name, users.email, users.gender, users.createdAt,
           locations.city, locations.country
    FROM users
    JOIN locations ON users.id = locations.userId
    WHERE 1=1
  `;

  let countQuery = `
    SELECT COUNT(*) AS total
    FROM users
    JOIN locations ON users.id = locations.userId
    WHERE 1=1
  `;

  const values = [];
  let count = 1;

  // Filter by gender if provided and not 'undefined'
  if (gender && gender !== 'undefined') {
    baseQuery += ` AND users.gender = $${count}`;
    countQuery += ` AND users.gender = $${count}`;
    values.push(gender);
    count++;
  }

  // Filter by city if provided and not 'undefined'
  if (city && city !== 'undefined') {
    baseQuery += ` AND locations.city = $${count}`;
    countQuery += ` AND locations.city = $${count}`;
    values.push(city);
    count++;
  }

  // Filter by country if provided and not 'undefined'
  if (country && country !== 'undefined') {
    baseQuery += ` AND locations.country = $${count}`;
    countQuery += ` AND locations.country = $${count}`;
    values.push(country);
    count++;
  }

  // Search functionality: Filter by name or email
  if (search) {
    baseQuery += ` AND (users.name ILIKE $${count} OR users.email ILIKE $${count})`;
    countQuery += ` AND (users.name ILIKE $${count} OR users.email ILIKE $${count})`;
    values.push(`%${search}%`);  // `%search%` for partial matching
    count++;
  }

  // Adding pagination
  const offset = (page - 1) * limit;
  baseQuery += ` ORDER BY users.id DESC LIMIT ${limit} OFFSET ${offset}`;

  // Execute both queries
  try {
    const result = await db.query(baseQuery, values);
    const countResult = await db.query(countQuery, values);

    let data = result.rows;
    const totalUser = parseInt(countResult.rows[0].total, 10);

    // Optional: Filter the fields if provided in the query
    if (fields) {
      const fieldList = fields.split(',');
      data = data.map((item) => {
        const filtered = {};
        for (const field of fieldList) {
          if (field in item) filtered[field] = item[field];
        }
        return filtered;
      });
    }

    res.status(200).json({ success: true, totalUser, results: data });
  } catch (error) {
    console.error("Error executing queries:", error);
    res.status(500).json({ success: false, message: "Error executing queries" });
  }
}


