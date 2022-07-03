import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: false,
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: false,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  collectCoverageFrom: ['**/*.(t|j)s'],
  setupFiles: ['dotenv/config'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testRegex: '.*\\.spec\\.ts$',
  coverageDirectory: '../coverage',
};
export default config;
