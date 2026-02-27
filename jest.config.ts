import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",

  roots: ["<rootDir>/app"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  testMatch: [
    "**/*.spec.ts",
    "**/*.test.ts",
  ],

  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },

  collectCoverageFrom: [
    "app/domain/**/*.ts",
  ],

  coverageDirectory: "coverage",

  clearMocks: true,
};

export default config;
