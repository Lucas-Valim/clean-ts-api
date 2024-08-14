// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('./jest.config.cjs')
config.testMatch = ['**/*.spec.ts']
module.exports = config
