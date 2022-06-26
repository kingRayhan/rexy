/**
 * Get the environment variable.
 * @param key The env variable key.
 * @param defaultValue The default value.
 * @returns The env variable value.
 */
const env = (key: string, defaultValue = '') => {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  return value;
};
export default env;
