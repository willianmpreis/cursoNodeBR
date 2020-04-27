const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')

const PASSWORD = 'M1nh@S3nh4'
const HASH_PASSWORD = '$2b$04$M1V/Rm78gwFaxoWUZXzHye6BRjmWHpJGKGxL61uq7vac9C27tSW0e'

describe('UserHelper test suite', function() {
    it('Must generate a hash from a password', async () => {
        const result = await PasswordHelper.hashPassword(PASSWORD)
        assert.ok(result.length > 10)
    })
    it('Must compare a password and its hash', async () => {
        const result = await PasswordHelper.comparePassword(PASSWORD, HASH_PASSWORD)
        assert.ok(result)
    })
})