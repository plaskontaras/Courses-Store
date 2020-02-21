const {Router} = require('express')
const Course = require('../models/course')
const router = Router()

const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  // const courses = await Course.getAll() // code for text file
  const courses = await Course.find()
  .populate('userId')// make userid object
  .select('title price img')
  
  res.render('courses', {
    title: 'Курсы',
    isCourses: true,
    courses
  })
})

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }

  // const course = await Course.getById(req.params.id) // code for text file
  const course = await Course.findById(req.params.id)

  res.render('course-edit', {
    title: `Редактировать ${course.title}`,
    course
  })
})

router.post('/edit', auth, async (req, res) => {
  // await Course.update(req.body) // code for text files
  const {id} = req.body
  delete req.body.id
  await Course.findByIdAndUpdate(id, req.body)
  res.redirect('/courses')
})

router.post('/remove',auth, async (req,res) => {
  // const {id} = req.body
  // delete req.body.id
  
  // await Course.findByIdAndDelete(id)
  // res.redirect('/courses') // work code from me

  try{
    await Course.deleteOne({_id: req.body.id})
    res.redirect('/courses')
  } catch(e) {
    console.log(e);
  }
})

router.get('/:id', async (req, res) => {
  // const course = await Course.getById(req.params.id) // code for text file
  const course = await Course.findById(req.params.id)
  res.render('course', {
    layout: 'empty',
    title: `Курс ${course.title}`,
    course
  })
})

module.exports = router