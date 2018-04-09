// Require everything needed
var express = require('express')
var bodyParser = require('body-parser')
var multer = require('multer')
var mysql = require('mysql')
var bcrypt = require('bcrypt')
var chalk = require('chalk')

require('dotenv').config()

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
  .get('/', index)
  .get('/index', index)
  .get('index.html', index)

  .get('/profile', render)
  .get('/chatlist', render)
  .get(/html/, render)
  .post('/', register)
  .get('/register', render)
  .get('/login', render)
  // .use('/', render)

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

// // create established
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
  console.log(chalk.red('[Server] Requested path was ' + req.path))
  // render index.ejs
  res.render('index', {data: data})
}

// get path and render page
function render(req, res) {
  // get the url and put it in a var
  var reqPath = req.path.replace('/', '').replace('.html', '')
  // try to render the requested url
  console.log(chalk.red('[Server] The req url was: ' + reqPath))
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
      res.redirect('/')
    }
  }
}

// handle 'couldn't get ... requests'
function notFound(req, res) {
  res.status(404).render('error', {error: '404 Not found. We could not find this page :('})
}
