// Require everything needed
var express = require('express')
var bodyParser = require('body-parser')
var multer = require('multer')
var mysql = require('mysql')
var chalk = require('chalk')

require('dotenv').config()

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
  .set('view engine', 'ejs')
  .set('views', 'view')
  .use(express.static('static'))
  .use(bodyParser.urlencoded({extended: true}))
  .get('/', index)
  .get('/index', index)
  .get('index.html', index)

  .get('/profile', render)
  .get('/chatlist', render)
  // .get('/error', render)
  .get(/html/, render)
  .post('/', addUser)
  .get('/register', render)
  // .use('/', render)

  .use(notFound)
  .listen(3000, () => console.log(chalk.green('server running on port 3000...')))

function index(req, res) {
  // log req.path
  console.log(chalk.red('Requested path was ' + req.path))
  // render index.ejs
  res.render('index', {data: data})
}

function render(req, res) {
  // get the url and put it in a var
  var reqPath = req.path.replace('/', '').replace('.html', '')
  // try to render the requested url
  console.log(chalk.red('The req url was: ' + reqPath))
  // render page
  res.render(reqPath)
}

// function form(req, res) {
//
//   res.render('register')
// }

function addUser(req, res) {
  data.push({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })
  res.redirect('/')
}

function notFound(req, res) {
  res.status(404).render('error', {error: '404 Not found. We could not find this page :('})
}
