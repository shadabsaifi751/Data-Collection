import axios from 'axios';
import db from './db.js';

// Function to fetch users from external API and store in database
export const fetchAndStoreUsers = async () => {
  try {
    // Fetch 5 random users from the Random User API
    const res = await axios.get('https://randomuser.me/api/?results=5');
    const users = res.data.results;

    // Loop through each user and insert into the database
    for (const user of users) {
      // Extract name components and format full name
      const { first, last } = user.name;
      const name = `${first} ${last}`;
      const { email, gender } = user;
      const { city, country } = user.location;

      // Insert user data into the 'users' table and retrieve the generated user ID
      const insertUser = await db.query(
        'INSERT INTO users (name, email, gender) VALUES ($1, $2, $3) RETURNING id',
        [name, email, gender]
      );

      const userId = insertUser.rows[0].id;

      // Insert location data into the 'locations' table with reference to the user ID
      await db.query(
        'INSERT INTO locations (userId, city, country) VALUES ($1, $2, $3)',
        [userId, city, country]
      );
    }

    // Log success message
    console.log('Users added');
  } catch (error) {
    // Log error if fetching or storing users fails
    console.error('Failed to fetch or store users:', error.message);
  }
};
