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
  .get('/error', render)
  .listen(3000, () => console.log('server running on port 3000...'))

function index(req, res) {
  res.render('index')
}

function render(req, res) {
  try {
    var urlObj = url.parse(req.url)
    var urlPath = urlObj.path.replace('/', '')
    res.render(urlPath)
  } catch (err) {
    res.status(404)
    res.render('error')
  }
}
