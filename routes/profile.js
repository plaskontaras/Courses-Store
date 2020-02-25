//EXPRESS
const {Router} = require('express')
const router = Router()
//AUTH
const auth = require('../middleware/auth')

// MODELS
const User = require('../models/user')

router.get('/',auth, async (req,res) => {
    res.render('profile', {
        title: 'Профиль',
        isProfile: true,
        user: req.user.toObject()
    })
})

router.post('/', auth, async (req,res) => {
    try {
        const user = await User.findById(req.user._id)
        
        const toChange = {
            name: req.body.name,
        }

        // console.log(req.file);
        
        if (req.file) {
            toChange.avatarURL = req.file.path
        }

        Object.assign(user, toChange)
        await user.save()
        res.redirect('/profile')
    } catch(e) {
        console.log(e);
    }
})

module.exports = router