var express = require('express')

module.exports = express()
  .set('view engine', 'ejs')
  .set('views', 'view')
  // .use(express.static('static'))
  .get('/', onrequest)
  .listen(1908)

function onrequest(req, res) {
  res.render('index')
}
