export default () => ({
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  mode: process.env.NODE_ENV,
  port: parseInt(process.env.PORT),
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    name: process.env.DATABASE_NAME,
    nameTest: process.env.DATABASE_NAME_TEST,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    sync: process.env.DATABASE_SYNC === 'true',
  },
  jwt: {
    access: {
      secret: process.env.JWT_ACCESS_SECRET,
      expire: process.env.JWT_ACCESS_EXPIRE || '15m',
    },
    refresh: {
      secret: process.env.JWT_REFRESH_SECRET,
      expire: process.env.JWT_REFRESH__EXPIRE || '1h',
    },
  },
  PER_PAGE: process.env.PER_PAGE || 30,
});
