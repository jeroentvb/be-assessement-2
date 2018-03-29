var express = require('express')
var url = require('url')

module.exports = express()
  .set('view engine', 'ejs')
  .set('views', 'view')
  .use(express.static('static'))
  .get('/', index)
  .get('/index', index)
  .get('/profile', render)
  .get('/chatlist', render)
  .listen(3000, () => console.log('server running on port 3000...'))

function index(req, res) {
  res.render('index')
}

function render(req, res) {
  var urlObj = url.parse(req.url)
  var urlPath = urlObj.path.replace('/', '')
  res.render(urlPath)
}
