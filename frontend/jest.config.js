const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  passWithNoTests: true,
  roots: ["<rootDir>"],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  globals: {
    window: {
      location: {
        host: "http://localhost",
      },
    },
  },
};
