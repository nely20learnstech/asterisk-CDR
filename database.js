const { Pool } = require('pg');

const pool = new Pool({
    user: 'asterisk',
    host: '192.168.0.107',
    database: 'cdrasterisk',
    password: '31janvier2005',
  port: 5432, // The default PostgreSQL port is 5432
});

// Use the pool to execute queries
pool.query('SELECT NOW()')
  .then(result => {
    console.log('Query result:', result.rows[0]);
  })
  .catch(err => {
    console.error('Error executing query:', err);
  });

// When your Node.js application is shutting down, close the pool
pool.end()
  .then(() => console.log('Connection pool closed'))
  .catch(err => console.error('Error closing connection pool', err));
