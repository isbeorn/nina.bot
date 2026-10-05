const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const dotenv = require('dotenv');

test('dotenv loads configuration while preserving deployment environment values', () => {
    const environment = { GUILD_ID: 'existing-guild' };
    const result = dotenv.config({
        path: path.join(__dirname, 'fixtures', 'settings.env'),
        processEnv: environment,
        quiet: true
    });

    assert.equal(result.error, undefined);
    assert.deepEqual(environment, {
        CLIENT_ID: '123456789',
        GUILD_ID: 'existing-guild',
        PRIVACY_POLICY_URL: 'https://example.com/privacy#details'
    });
});
