module.exports = {
  development: {
    username: "root",
    password: "web",
    database: "time_manager",
    host: "127.0.0.1",
    port: 3307,
    dialect: "mariadb",
    dialectOptions: {
      allowPublicKeyRetrieval: true,
    },
    migrationStorageTableName: "_migrations",
  },
  test: {
    username: "root",
    password: "web",
    database: "time_manager",
    host: "127.0.0.1",
    port: 3307,
    dialect: "mariadb",
    migrationStorageTableName: "_migrations",
  },
  production: {
    username: process.env.DB_USERNAME || undefined,
    password: process.env.DB_PASSWORD || undefined,
    database: process.env.DB_DBNAME || undefined,
    host: process.env.DB_HOST || undefined,
    port: process.env.DB_PORT || undefined,
    dialect: "mariadb",
    migrationStorageTableName: "_migrations",
  },
};
