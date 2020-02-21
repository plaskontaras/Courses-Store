const { Router } = require('express');
const router = Router();

const User = require('../models/user.js')

const bcrypt = require('bcryptjs');

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
        const { email, password} = req.body;
        const candidate = await User.findOne({ email })

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password);

            if (areSame) {
                // const user = await User.findById('5e4d443ece861d23ecec4b9b');
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

router.post('/register', async (req, res) => {
    try {
        const { email, password, repeat, name } = req.body;

        // here we have to verify is user already exist
        const candidate = await User.findOne({ email })


        if (candidate) {
            req.flash('registerError', 'Пользователь с таким email уже существует')
            res.redirect('/auth/login#register')
        } else {

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
        }
    } catch (e) {
        console.log(e);
    }
})

module.exports = router;