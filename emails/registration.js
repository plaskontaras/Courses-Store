const keys = require('../keys')

module.exports = function (email) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: 'Account was created',
        html: `
            <h1>Welcome to our store</h1>
            <p>Your account with email - ${email} was created successfully</p>
            <hr />
            <a href="${keys.BASE_URL}">Courses shop</a>
            `
    }
}