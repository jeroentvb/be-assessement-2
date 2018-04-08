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
  .get('/', render)
  // .get('*', render)
  .get('/index', render)
  .get('/profile', render)
  .get('/chatlist', render)
  .get('/error', render)
  .get(/html/, render)
  .listen(3000, () => console.log(chalk.green('server running on port 3000...')))

function index(req, res) {
  res.render('index')
}

function render(req, res, err) {
  // get the url and put it in a var
  var urlPath = req.path.replace('/', '').replace('.html', '')
  try {
    // try to render the requested url
    console.log(chalk.red('The req url was: ' + urlPath))
    res.render(urlPath, {data: data})
  } catch (err) {
    res.status(404)
    res.render('error')
  }
}
