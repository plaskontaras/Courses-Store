//LIBS
const express = require('express')
const path = require('path')
const mongoose = require('mongoose'); //using mongoose we can connect to MongoDB
const exphbs = require('express-handlebars')
const csrf = require('csurf')
const flash = require('connect-flash')

//SESSION
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)


//ROUTES
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const ordersRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const profileRoutes = require('./routes/profile')

//MODELS
const User = require('./models/user');

//MIDDLEWARE
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user.js')
const errorHandler = require('./middleware/error')
const fileMiddleware = require('./middleware/file')

const keys = require('./keys')
const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/hbs-helpers')
})

const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI

})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))

app.use('/images', express.static(path.join(__dirname, 'images')))

console.log(path.join(__dirname, 'images'));


app.use(express.urlencoded({ extended: true }))

// tune session
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}))

app.use(fileMiddleware.single('avatar'))// 'avatar' is a field where we will store image

app.use(csrf()) // token
app.use(flash())
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)
app.use('/profile', profileRoutes)

app.use(errorHandler) // required to connect in the end of all .use()

const PORT = process.env.PORT || 8080

async function start() {
  try {

    await mongoose.connect(keys.MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
    const candidate = await User.findOne()

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (e) {
    console.log(e);
  }
}

start()

const password = 'Mw1l6eMxzdO6J6ve';
