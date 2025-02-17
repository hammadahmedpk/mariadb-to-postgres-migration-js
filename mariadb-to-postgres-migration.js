const mysql = require('mysql2/promise');
const { Client } = require('pg');
const config = require('config');

// function to escape column names
const escapeColumn = (column) => `"${column.replace(/"/g, '""')}"`;

(async () => {
  // MariaDB connection details
  const mariadbConnection = await mysql.createConnection({
    host: config.get('dbConfiguration.host'),
    user: config.get('dbConfiguration.username'),
    password: config.get('dbConfiguration.password'),
    database: config.get('dbConfiguration.database'),
    port: config.get('dbConfiguration.port'),
    ssl: { enabled: true, rejectUnauthorized: false },
  });

  // PostgreSQL connection details
  const pgClient = new Client({
    host: config.get('dbConfigurationADMIN.host'),
    user: config.get('dbConfigurationADMIN.username'),
    password: config.get('dbConfigurationADMIN.password'),
    database: config.get('dbConfigurationADMIN.database'),
    port: config.get('dbConfigurationADMIN.port'),
    ssl: true,
  });

  try {
    await pgClient.connect();

    console.log('connection has been established for both database');

    await pgClient.query('BEGIN');

    await mariadbConnection.beginTransaction();

    console.log('transaction started');

    // List of tables to transfer
    const tables = [
      'zdp_app',
      'company',
      'company_app_status',
      'user',
      'role',
      'user_role',
      'group',
      'group_role',
      'user_group',
      'notification_config',
      'ssh-key',
      'resource_share',
    ];

    for (let table of tables) {
      console.log(`insertion for the table ${table}`);

      // if (table === 'company') {
      //   console.log('disable for company');
      //   await pgClient.query('ALTER TABLE company DISABLE TRIGGER ALL');
      // }

      // Fetch data from each table in MariaDB
      const [rows] = await mariadbConnection.execute(
        `SELECT * FROM \`${table}\``,
      );

      for (let row of rows) {
        console.log(row?.id);

        // const columns = Object.keys(row).join(', ');
        const columns = Object.keys(row).map(escapeColumn).join(', ');
        const values = Object.values(row);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

        const insertQuery = `INSERT INTO "${table}" (${columns}) VALUES (${placeholders})`;
        await pgClient.query(insertQuery, values);
      }

      // if (table === 'company') {
      //   console.log('enable for company');
      //   await pgClient.query('ALTER TABLE company ENABLE TRIGGER ALL');
      // }
    }

    // commit once all done
    await pgClient.query('COMMIT');
    await mariadbConnection.commit();

    console.log('Data transfer complete.');
  } catch (error) {
    // Rollback
    console.error('Error occurred:', error);
    await pgClient.query('ROLLBACK');
    await mariadbConnection.rollback();
  } finally {
    // Close connections
    await mariadbConnection.end();
    await pgClient.end();
  }
})();

/**
 * 
 * tables squence 
 * 
 * 
  const tables = [
      'zdp_app',
      'company',
      'company_app_status',
      'user',
      'role',
      'user_role',
      'group',
      'group_role',
      'user_group',
      'notification_config',
      'ssh-key',
      'resource-share',
    ];
 * 
 * 
 * =================================================================
 *  
 * SKIP FOR DATA MIGRATIONS
 * request   (optional)
 * notification (optional)
 * email (optional)
 * activity_log
 * group_role_v2
 * migrations
 * typeorm_metadata
 * user_role_v2

 */
