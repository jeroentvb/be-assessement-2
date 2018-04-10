// Require everything needed
var express = require('express')
var session = require('express-session')
var bodyParser = require('body-parser')
var multer = require('multer')
var mysql = require('mysql')
var bcrypt = require('bcrypt')
var chalk = require('chalk')

require('dotenv').config()

// multer
var upload = multer({dest: 'static/upload/'})

// bycript
const saltRounds = 10

// create mysql connection
var db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
// connect to db
db.connect(function(err) {
  if(err){
    throw err;
  } else {
    console.log(chalk.green('[MySql] connection established..'))
  }
})

var data = [
  {
    email: 'test@example.com',
    name: 'Julia',
    avatar: 'julia',
    tagline: '"Bingewatching black mirror"',
    series: [
      'westworld',
      'black-mirror'
    ]
  },
  {
    email: 'megan@example.com',
    name: 'Megan',
    avatar: 'megan',
    tagline: 'test',
    series: [
      'black-mirror',
      'westworld'
    ]
  },
  {
    email: 'joopie@example.com',
    name: 'Joopie',
    avatar: 'test',
    tagline: 'Ik ben joopie',
    series: [
      'westworld',
    ]
  }
]

// Add HTTP requests
module.exports = express()
  // .get('/createdb', createDb)
  // .get('/addusr', addUsr)

  .set('view engine', 'ejs')
  .set('views', 'view')
  .use(express.static('static'))
  .use(bodyParser.urlencoded({extended: true}))
  .use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  }))
  .get('/', index)
  .get('/index', index)
  .get('index.html', index)
  .get('/profile' || 'profile.html', profile)
  .get('/chatlist', render)
  .get(/html/, render)
  .post('/', register)
  .get('/register', render)
  .get('/login', render)
  .post('/log-in', login)
  .get('/log-out', logout)

  .use(notFound)
  .listen(3000, () => console.log(chalk.green('[Server] listening on port 3000...')))

// // create db
// function createDb(req, res) {
//   var sql = 'CREATE DATABASE datingsite'
//   db.query(sql, function(err, result) {
//     if(err){
//       throw err
//     } else {
//       console.log(chalk.yellow(result))
//       res.send('Database created')
//     }
//   })
// }

// // create create users table
// function addUsr(req, res) {
//   var sql = 'CREATE TABLE users(id int NOT NULL AUTO_INCREMENT, email VARCHAR(255), password VARCHAR(255), name VARCHAR(255), tagline VARCHAR(255), PRIMARY KEY (id))'
//   db.query(sql, function(err, result) {
//     if(err) {
//       throw err
//     } else {
//       console.log(chalk.yellow(result))
//       res.send('Table created')
//     }
//   })
// }

// render index
function index(req, res) {
  // log req.path
  console.log(chalk.yellow('[Server] Requested path was ' + req.path))
  // Get random selection of users from db
  db.query('SELECT name, tagline FROM users ORDER BY RAND() LIMIT 3', done)
  function done(err, results) {
    // JSON.stringify(results, null, 4) <-- got this from https://stackoverflow.com/questions/1625208/print-content-of-javascript-object?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
    console.log(chalk.red('These are the query results: \n' + JSON.stringify(results, null, 4)))
    // render index.ejs
    res.render('index', {
      users: results
    })
  }
}

function profile(req, res, next) {
  console.log(chalk.yellow('[Server] Requested path was ' + req.path))
  // console.log(chalk.red(`req.session.user is ${req.session.user}`))
  // console.log(chalk.red(`req.session.email is ${req.session.email}`))
  if (req.session.user == undefined) {
    res.status(401).render('needlogin')
  } else {
    var currentUser = req.session.user.name
    // Log current session user's name
    // console.log(chalk.blue(`the current user is ${currentUser}`))

    db.query('SELECT tagline FROM users WHERE name = ?', currentUser, done)

    function done(err, results) {
      // Log the data got from the db
      console.log(chalk.red('These are the query results: \n' + JSON.stringify(results, null, 4)))
      // log the tagline
      // console.log(chalk.blue(results[0].tagline))
      if (results[0].tagline == null) {
        // If there is no tagline
        res.render('profile', {
          user: req.session.user,
          tagline: 'You have no tagline set'
        })
      } else if(err) {
        // if error
        next(err)
      } else {
        // if everything is found
        res.render('profile', {
          user: req.session.user,
          tagline: results[0].tagline
        })
      }
    }
  }
}

// get path and render page
function render(req, res) {
  // get the url and put it in a var
  var reqPath = req.path.replace('/', '').replace('.html', '')
  // try to render the requested url
  console.log(chalk.yellow('[Server] The req url was: ' + reqPath))
  // render page
  res.render(reqPath)
}

// register
function register(req, res) {
  // get the contents of the form and put them in variables
  var name = req.body.name
  var email = req.body.email
  var passwd = req.body.password
  // define min and max passwd length
  var passwdLength = {
    min: 6,
    max: 100
  }
  // check if everything is filled in
  if (!name || !email || !passwd) {
    res.status(400).send('Name, email or password are missing!')
    return
  }
  // check if passwd is long enough but not too long
  if (passwd.length < passwdLength.min || passwd.length > passwdLength.max) {
    res.status(400).send(`Your password must be between ${passwdLength.min} and ${passwdLength.max} characters.`)
    return
  }
  // hash the passwd and send the form data to the database
  bcrypt.hash(passwd, saltRounds, function(err, hash) {
  db.query('INSERT INTO users SET ?', {
    name: name,
    email: email,
    password: hash
  }, done)
})
  // check if an error ocurred, else: redirect to /
  function done(err, data) {
    if(err){
      next(err)
    } else {
      req.session.user = {email: user.email}
      res.redirect('/')
    }
  }
}

// Log in
function login(req, res, next) {
  // Get form data
  var email = req.body.email
  var passwd = req.body.password

  // If there is form data missing give an error
  if (!email || !passwd) {
    res.status(400).send('Email or password are missing!')
    return
  }
  // get email from form and look if it exists in the database
  db.query('SELECT * FROM users WHERE email = ?', email, done)

  function done(err, data) {
    var user = data && data[0]
    // log the user object
    // console.log(chalk.red(JSON.stringify(user, null, 4)))
    // log the user's name
    // console.log(chalk.blue(user.name))
    // log the user's email
    // console.log(chalk.blue(user.email))

    if (err) {
      next(err)
    } else if (user) {
      // if the email is found, get the password and check if it matches
      bcrypt.compare(passwd, user.password).then(onverify, next)
    } else {
      // send error if email doesn't exist in db
      res.status(401).send('email does not exist!')
    }

    function onverify(match) {
      if (match) {
        // set session cookie and redirect
        req.session.user = {name: user.name}
        // log the session.user object
        // console.log(chalk.red(JSON.stringify(req.session.user, null, 4)))
        res.redirect('/profile')
      } else {
        // error if the password is incorrect
        res.status(401).send('Incorrect password')
      }
    }
  }
}

function logout(req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      next(err)
    } else {
      res.redirect('/')
    }
  })
}

// handle 'couldn't get ... requests'
function notFound(req, res) {
  res.status(404).render('error', {error: '404 Not found. We could not find this page :('})
}
