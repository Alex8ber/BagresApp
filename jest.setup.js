// Jest setup file for React Native testing

// Mock Expo's winter runtime before it's loaded
global.__ExpoImportMetaRegistry = {};
global.structuredClone = global.structuredClone || ((obj) => JSON.parse(JSON.stringify(obj)));

// Set up global test timeout
jest.setTimeout(10000);
