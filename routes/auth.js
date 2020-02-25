const { Router } = require('express');
const router = Router();
const keys = require('../keys')

const reqEmail = require('../emails/registration')
const resetEmail = require('../emails/reset')

const crypto = require('crypto');// we can use it without npm install

// VALIDATORS
const { validationResult } = require('express-validator')
const { registerValidators } = require('../utils/validators')


const User = require('../models/user.js')

const bcrypt = require('bcryptjs');

const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')


const transporter = nodemailer.createTransport(sendgrid({
    auth: { api_key: keys.SENDGRID_API_KEY }
}))

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    });
})

router.get('/logout', async (req, res) => {
    // req.session.isAuthenticated = false  <==>
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const candidate = await User.findOne({ email })

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password);

            if (areSame) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    }
                    res.redirect('/')
                })
            } else {
                req.flash('loginError', 'Неверный пароль')
                res.redirect('/auth/login#login')
            }
        }
        else {
            req.flash('loginError', 'Такого пользователя не существует')
            res.redirect('/auth/login#login')
        }
    } catch (e) {
        console.log(e);
    }
})

router.post('/register', registerValidators, async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // here we have to verify is user already exist
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            req.flash('registerError', errors.array()[0].msg)
            return res.status(422).redirect('/auth/login#register');
        }
        // crypt password when user register
        const hashPassword = await bcrypt.hash(password, 10) // where 10 is a salt

        const user = new User({
            email,
            password: hashPassword,
            name,
            cart: { items: [] }
        })
        await user.save()
        res.redirect('/auth/login#login')
        await transporter.sendMail(reqEmail(email))

    } catch (e) {
        console.log(e);
    }
})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: 'Забыли пароль?',
        error: req.flash('error')
    })
})

// here we create code for password reset
router.post('/reset', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                req.flash('error', 'Что-то пошло не так. Повторите попытку позже...')
                return res.redirect('/auth/reset')
            }

            const token = buffer.toString('hex')
            const candidate = await User.findOne({ email: req.body.email })

            if (candidate) {
                candidate.resetToken = token;
                candidate.resetTokenExp = Date.now() + 3600 * 1000;
                await candidate.save()
                await transporter.sendMail(resetEmail(candidate.email, token))
                res.redirect('/auth/login#login')
            } else {
                req.flash('error', 'Такого email нет')
                res.redirect('/auth/reset')
            }
        })
    } catch (e) {
        console.log(e);
    }
})

module.exports = router;