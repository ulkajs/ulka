import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testMatch: ['**/*.test.[jt]s'],
  collectCoverage: !process.env.DONT_COLLECT_COVERAGE,
  collectCoverageFrom: [
    'packages/**/src/**/**.ts',
    '!**/**/cli.ts',
    '!packages/create-ulka/**',
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
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
