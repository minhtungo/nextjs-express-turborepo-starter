export * from './constants';
export * from './env';
export { Config } from './config';

// Create and export a singleton instance
import { Config } from './config';

const config = new Config();

export default config;
