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
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.base.json',
    },
  },
}

export default config
