# MariaDB to PostgreSQL Migration

A Node.js script to migrate data from MariaDB to PostgreSQL using transactions and prepared statements.

## 🚀 Features
- Transfers data from MariaDB to PostgreSQL efficiently
- Uses transactions to ensure data consistency
- Escapes column names properly to prevent SQL errors
- Handles SSL connections for secure database communication
- Supports selective table migration

## 📜 Prerequisites
- Node.js (v14 or later)
- MariaDB and PostgreSQL databases set up
- Required tables in PostgreSQL
- `config` package for managing database credentials

## 🔧 Setup

### 1️⃣ Clone the repository
```sh
git clone https://github.com/hammadahmedpk/mariadb-to-postgres-migration.git
cd mariadb-to-postgres-migration
```

### 2️⃣ Install dependencies
```sh
npm install mysql2 pg config
```

### 3️⃣ Configure database connections
Modify config/default.json with your database credentials:

```sh
{
  "dbConfiguration": {
    "host": "mariadb-host",
    "username": "your-mariadb-user",
    "password": "your-mariadb-password",
    "database": "your-mariadb-db",
    "port": 3306
  },
  "dbConfigurationADMIN": {
    "host": "postgres-host",
    "username": "your-postgres-user",
    "password": "your-postgres-password",
    "database": "your-postgres-db",
    "port": 5432
  }
}
```

### 4️⃣ Run the script
```sh
node mariadb-to-postgres-migration.js
```
