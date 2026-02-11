import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: [
    "**/__tests__/**/*.{ts,tsx}",
    "**/*.{spec,test}.{ts,tsx}",
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/src/__mocks__/fileMock.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterSetup: ["@testing-library/jest-dom"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.ts",
    "!src/__mocks__/**",
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 70,
      statements: 70,
    },
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};

export default config;