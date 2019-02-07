module.exports = {
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx',
  ],
  testMatch: [
    '<rootDir>/__tests__/**/*.(test|spec).(ts|tsx)',
  ],
  globals: {
    'ts-jest': {
      tsConfig: 'jest.tsconfig.json',
    },
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'enzyme.js',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/__tests__/enzyme.js'],
  coverageReporters: [
    'json',
    'lcov',
    'text',
    'text-summary',
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/mocks.js',
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/mocks.js',
  },
  preset: 'ts-jest',
}
