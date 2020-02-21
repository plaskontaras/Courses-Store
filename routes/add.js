// const {Router} = require('express')
// const Course = require('../models/course')
// const router = Router()

// router.get('/', (req, res) => {
//   res.render('add', {
//     title: 'Добавить курс',
//     isAdd: true
//   })
// })

// router.post('/', async (req, res) => {
//   const course = new Course(req.body.title, req.body.price, req.body.img)

//   await course.save()

//   res.redirect('/courses')
// })

// module.exports = router // code for work with text

const {Router} = require('express')
const Course = require('../models/course')
const router = Router()

const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Добавить курс',
    isAdd: true
  })
})

router.post('/', auth,  async (req, res) => {
  // const course = new Course(req.body.title, req.body.price, req.body.img) // code for work with text files
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user
  })

  try{
    await course.save()
    res.redirect('/courses')
  } catch(e) {
    console.log(e);
  }


})

module.exports = router