// jest.config.ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  testPathIgnorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    '__tests__/fixtures/',
  ],
  collectCoverageFrom: [
    '**/*.ts',
    '!jest.config.ts',
    '!dist/**',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!types/**',
  ],
  setupFilesAfterEnv: [
    './__tests__/fixtures/setup_env.ts',
    './__tests__/fixtures/setup_context.ts',
  ],
};

export default config;
