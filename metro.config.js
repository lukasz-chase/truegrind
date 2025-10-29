// metro.config.js
const { getDefaultConfig } = require("@expo/metro-config"); // <-- change this line

/** @type {import('@expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// keep your tweak if you need it
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
