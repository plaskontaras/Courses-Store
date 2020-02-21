//LIBS
const express = require('express')
const path = require('path')
const mongoose = require('mongoose'); //using mongoose we can connect to MongoDB
const exphbs = require('express-handlebars')
const csrf = require('csurf')
const flash= require('connect-flash')

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

//MODELS
const User = require('./models/user');

//MIDDLEWARE
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user.js')

const MONGODB_URI = 'mongodb+srv://taras:Mw1l6eMxzdO6J6ve@cluster0-vg0ap.mongodb.net/shop';// public link which access us to connect to DB
const app = express()

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

const store = new MongoStore({
  collection: 'sessions',
  uri: MONGODB_URI

})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

//middlware
// app.use( async (req, res, next) => {

//   try {
//     const user = await User.findById('5e4d443ece861d23ecec4b9b');
//     req.user = user
//     next()
//   } catch (e) {
//     console.log(e);
//   }

// }) // we made thi in auth post 

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

// tune session
app.use(session({
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
  store
}))


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

const PORT = process.env.PORT || 8080

async function start() {
  try {
   
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false , useUnifiedTopology: true })
    const candidate = await User.findOne()

    // if (!candidate) {
    //   const user = new User({
    //     email: 'tarasplaskon@gmail.com',
    //     name: 'Taras',
    //     cart: { items: [] }
    //   })
    //   await user.save();
    // }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (e) {
    console.log(e);
  }
}

start()

const password = 'Mw1l6eMxzdO6J6ve';
