module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.app.json',
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: { metaObjectReplacement: { env: { VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_mock' } } }
            }
          ]
        }
      },
    ],
  },
  setupFilesAfterEnv: ['./src/setupTests.ts'],
  moduleNameMapper: {
    // Mock CSS imports
    '\.css$': 'identity-obj-proxy',
  },
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
};