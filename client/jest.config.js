// jest.config.js
export default {
    preset: 'vite-jest',
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.jsx?$': 'babel-jest', // If using Babel
    },
  };
  