const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
app.use(express.static('assets'));


const pool = new Pool({
  user: 'asterisk',
  host: '192.168.166.11',
  database: 'cdrasterisk',
  password: '31janvier2005',
  port: 5432,
});

// Use session middleware
app.use(
  session({
    secret: 'north_secret_key', // Replace with a secret key of your choice
    resave: false,
    saveUninitialized: true,
  })
);

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));


// Create the users table and insert a test user
(async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) NOT NULL,
          password VARCHAR(100) NOT NULL
        )
      `);
  
    //   const hashedPassword = await bcrypt.hash('sweety', 10);
  
    //   await pool.query(
    //     'INSERT INTO users (username, password) VALUES ($1, $2)',
    //     ['North Blue', hashedPassword]
    //   );
    } catch (error) {
      console.error('Error setting up users table and inserting user:', error);
    }
  })();

// Serve your login page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Handle login form submission
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch the user with the given username from the database
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    console.log(result);

    if (result.rows.length === 1) {
      // User found, compare the provided password with the stored hash
      const user = result.rows[0];
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        // Password is correct, set a session and redirect to app.js
        req.session.loggedIn = true;
        res.redirect('/app');
      } else {
        // Password is incorrect, redirect back to the login page with an error message
        res.redirect('/?error=1');
        // res.status(401).json({ error: 'Invalid username or password' });
      }
    } else {
      // User not found, redirect back to the login page with an error message
      res.redirect('/?error=1');
    //   res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Serve your app.js page
app.get('/app', (req, res) => {
  // Check if the user is logged in
  if (req.session.loggedIn) {
    res.sendFile(__dirname + '/index.html');
  } else {
    // Redirect to the login page if not logged in
    res.redirect('/');
  }
});

app.get('/search', (req, res) => {
    // Check if the user is logged in
    // if (req.session.loggedIn) {
      res.sendFile(__dirname + '/search_page.html');
    // } else {
      // Redirect to the login page if not logged in
    //   res.redirect('/');
    // }
    // res.render('search_page')
  });

// Endpoint to fetch CDR data (you can use your existing /cdr endpoint)
app.get('/cdr', (req, res) => {
  pool.query('SELECT * FROM cdr ORDER BY calldate DESC', (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Error fetching data' });
    } else {
      res.json(result.rows);
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
