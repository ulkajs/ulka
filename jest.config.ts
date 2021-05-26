import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testMatch: ['**/*.test.[jt]s'],
  collectCoverage: !process.env.DONT_COLLECT_COVERAGE,
  collectCoverageFrom: [
    'packages/**/src/**/**.ts',
    '!**/**/cli.ts',
    '!packages/create-app/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testTimeout: 30000,
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.base.json',
    },
  },
}

export default config
