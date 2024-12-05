import { config } from 'dotenv';
import { join } from 'path';
import * as packageJson from '../../package.json';

export default () => {
  const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
  config({ path: join(__dirname, '..', '..', envFile) });

  return {
    name: packageJson.name,
    version: packageJson.version,
    APP_URL: process.env.APP_URL || 'http://localhost:3000',
    mode: process.env.NODE_ENV,
    port: parseInt(process.env.PORT),
    database: {
      type: process.env.DATABASE_TYPE,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      name:
        process.env.NODE_ENV === 'test'
          ? process.env.DATABASE_NAME_TEST
          : process.env.DATABASE_NAME,
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
  };
};
