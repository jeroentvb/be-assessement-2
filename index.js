// Sources used:
// Backend lecture 4: https://docs.google.com/presentation/d/1PfEaV-jQdqKWByca9txp38yD8LWIDEWZzldNYBMwUNI/edit#slide=id.g3230fb1b6e_0_806
// Backend lecture 5: https://docs.google.com/presentation/d/1QVPTtENQ8d6td9ioNZHnbSoiilUZdsZ8n_F5naxw_Rw/edit#slide=id.g32339aa0a1_0_1186
// Backend lecture 6: https://docs.google.com/presentation/d/1BHMqO9UV5ePt29n8cnjaznvye8Gu_HrdzhzC3h5rgOI/edit#slide=id.g344fb1f29c_0_483
// Using mysql with nodejs: https://www.youtube.com/watch?v=EN6Dx22cPRI

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
  if (err) {
    throw err;
  } else {
    console.log(chalk.green('[MySql] connection established..'))
  }
})

// port to listen on
const port = 3000
// define min and max passwd length
const passwdLength = {
  min: 6,
  max: 100
}

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
  .get('/index' || 'index.html', index)
  .get('/profile' || 'profile.html', profile)
  .get('/chatlist' || 'chatlist.html', chatlist)
  .get('/settings' || 'settings.html', settings)
  .post('/update-avatar', upload.single('avatar'), updateAvatar)
  .post('/update-tagline', updateTagline)
  .post('/change-password', changePassword)
  .post('/remove', remove)
  .get('/register', render)
  .post('/', register)
  .get('/welcome', render)
  .get('/chooseseries', render)
  .post('/seriesChosen', seriesChosen)
  .get('/matchprefs', render)
  .post('/prefsChosen', prefsChosen)
  .get('/login', render)
  .post('/log-in', login)
  .get('/log-out', logout)
  .get('/xhr', xhr)
  .get(/html/, render)
  .use(notFound)
  .listen(port, () => console.log(chalk.green(`[Server] listening on port ${port}...`)))

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

// // create users table in db
// function addUsr(req, res) {
//   var sql = 'CREATE TABLE IF NOT EXISTS users(id int NOT NULL AUTO_INCREMENT, email VARCHAR(255), password VARCHAR(255), name VARCHAR(255), tagline VARCHAR(255), PRIMARY KEY (id))'
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
function index(req, res, next) {
  // log req.path
  console.log(chalk.yellow('[Server] Requested path was ' + req.path))
  // Show error if the user is not loggen in
  if (req.session.user == undefined) {
    res.status(401).render('needlogin', {
      page: 'Need login'
    })
  } else {
    // Get user's email
    var currentUser = req.session.user.email
    // console.log(chalk.red(`Current user's email: ${currentUser}`))
    // Get matchingpreferences from the db
    db.query('SELECT genderpref, agepref FROM users WHERE email = ?', currentUser, gotPrefs)
    function gotPrefs(err, data) {
      if (err) {
        next(err)
      } else {
        // console.log(chalk.red(JSON.stringify(data, null, 4)))
        var genderPref = data[0].genderpref
        var agePref = data[0].agepref
        // Get people from the db that match the preferences
        db.query('SELECT name, tagline, avatar, series1, series2 FROM users WHERE NOT genderpref = ? AND agepref = ? ORDER BY RAND() LIMIT 3', [genderPref, agePref], done)
        function done(err, results) {
          if (err) {
            next(err)
          } else {
            res.render('index', {
              users: results
            })
          }
        }
      }
    }
  }
}

// Render profile
function profile(req, res, next) {
  console.log(chalk.yellow('[Server] Requested path was profile'))
  // console.log(chalk.red(`req.session.user is ${req.session.user}`))
  // console.log(chalk.red(`req.session.email is ${req.session.email}`))
  if (req.session.user == undefined) {
    res.status(401).render('needlogin', {
      page: 'Need login'
    })
  } else {
    var currentUser = req.session.user.name
    // Log current session user's name
    // console.log(chalk.blue(`the current user is ${currentUser}`))
    db.query('SELECT tagline, avatar, series1, series2 FROM users WHERE name = ?', currentUser, done)
    function done(err, results) {
      if (err) {
        next(err)
      } else if (results[0].avatar == null) {
        // If there is no avatar
        res.render('profile', {
          user: req.session.user,
          avatar: 'default',
          tagline: results[0].tagline,
          series1: results[0].series1,
          series2: results[0].series2,
          page: 'Profile'
        })
      } else {
        // if everything is found
        res.render('profile', {
          user: req.session.user,
          tagline: results[0].tagline,
          avatar: results[0].avatar,
          series1: results[0].series1,
          series2: results[0].series2,
          page: 'Profile'
        })
      }
    }
  }
}

// Render Chatlist
function chatlist(req, res) {
  console.log(chalk.yellow('[Server] The requested path was chatlist'))
  if (req.session.user == undefined) {
    res.status(401).render('needlogin', {
      page: 'Need login'
    })
  } else {
    // Get user's email
    var currentUser = req.session.user.email
    db.query('SELECT genderpref, agepref FROM users WHERE email = ?', currentUser, gotPrefs)
    function gotPrefs(err, data) {
      if (err) {
        next(err)
      } else {
        // console.log(chalk.red(JSON.stringify(data, null, 4)))
        var genderPref = data[0].genderpref
        var agePref = data[0].agepref
        // Get people from the db that match the preferences
        db.query('SELECT name, avatar, tagline FROM users WHERE NOT genderpref = ? AND agepref = ? ORDER BY RAND() LIMIT 2', [genderPref, agePref], done)
        function done(err, results) {
          if (err) {
            next(err)
          } else {
            // console.log(chalk.blue(JSON.stringify(results, null, 4)))
            res.render('chatlist', {
              users: results,
              page: 'Chatlist'
            })
          }
        }
      }
    }
  }
}

// Render settings
function settings(req, res) {
  console.log(chalk.yellow('[Server] The requested path was settings'))
  if (req.session.user == undefined) {
    res.status(401).render('needlogin', {
      page: 'Need login'
    })
  } else {
    res.render('settings', {
      page: 'Settings'
    })
  }
}

// Update avatar
function updateAvatar(req, res, next) {
  // Get the uploaded file and the current user
  var avatar = req.file ? req.file.filename : null
  var currentUser = req.session.user.name
  // console.log(chalk.yellow(currentUser))
  // Put the avatar in the database for the correct user
  db.query('UPDATE users SET avatar = ? WHERE name = ?', [avatar, currentUser], done)
  function done(err, results) {
    if (err){
      next(err)
    } else {
      res.redirect('profile')
    }
  }
}

// Update Tagline
function updateTagline(req, res, next) {
  // Get the tagline and the current user
  var tagline = req.body.tagline
  var currentUser = req.session.user.name

  db.query('UPDATE users SET tagline = ? WHERE name = ?', [tagline, currentUser], done)
  function done(err, results) {
    if (err) {
      next(err)
    } else {
      res.redirect('profile')
    }
  }
}

// Change Password
function changePassword(req, res, next) {
  // get current user
  var currentUser = req.session.user.name
  // Get form data
  var oldPasswd = req.body.oldPasswd
  var newPasswd = req.body.newPasswd
  var confirmNewPasswd = req.body.confirmNewPasswd

  // check if passwd is long enough but not too long
  if (newPasswd.length < passwdLength.min || newPasswd.length > passwdLength.max) {
    res.status(400).render('error', {
      page: 'Error',
      error: `Your new password must be between ${passwdLength.min} and ${passwdLength.max} characters.`
    })
    return
  }

  if (newPasswd == confirmNewPasswd) {
    db.query('SELECT password FROM users WHERE name = ?', currentUser, done)
    function done(err, data) {
      if (err) {
        next(err)
      } else {
        var dbPasswd = data[0].password
        bcrypt.compare(oldPasswd, dbPasswd).then(onverify, next)
        function onverify(match) {
          if (match) {
            bcrypt.hash(newPasswd, saltRounds, function(err, hash) {
            db.query('UPDATE users SET password = ? WHERE name = ?', [hash, currentUser], done)
            })
            function done(err, results) {
              if (err) {
                next(err)
              } else {
                res.redirect('index')
              }
            }
          } else {
            res.status(409).render('error', {
              page: 'Error',
              error: 'Your current password does not match.'
            })
          }
        }
      }
    }
  } else {
    res.status(409).render('error', {
      error: 'Your new password does not match the confirmed password.',
      page: 'Error'
    })
  }
}

// get path and render page
function render(req, res) {
  // get the url and put it in a var
  var reqPath = req.path.replace('/', '').replace('.html', '')
  // try to render the requested url
  console.log(chalk.yellow('[Server] The req url was: ' + reqPath))
  // Make the first letter of the requested path upper case from: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
  var uppercaseReqPath = reqPath.charAt(0).toUpperCase() + reqPath.slice(1)
  // render page
  res.render(reqPath, {
    page: uppercaseReqPath
  })
}

// Add currently watching series
function seriesChosen(req, res) {
  // I know this function can me made a lot smaller by using the value of the html tag. But it works like this and I don't want to break it.
  // get current user
  var currentUser = req.session.user.name
  // get the contents of the form and put them in variables
  var westworld = req.body.westworld
  var blackMirror = req.body.blackMirror
  var poi = req.body.poi
  var arrow = req.body.arrow
  var flash = req.body.flash
  var breakingBad = req.body.breakingBad
  // Put the on or undefineds in an array
  var series = [
    westworld,
    blackMirror,
    poi,
    arrow,
    flash,
    breakingBad
  ]
  const seriesList = [
    'westworld',
    'blackMirror',
    'poi',
    'arrow',
    'flash',
    'breakingBad'
  ]
  // console.log(chalk.yellow(series))
  // console.log(chalk.red(`${westworld}\n${blackMirror}\n${poi}\n${arrow}\n${flash}\n${breakingBad}`))
  // Create array to push selected series to
  var seriesCount = []
  // Push all not undefined values to the seriesCount array
  for (let i=0; i < series.length; i++) {
    if (series[i] == 'on') {
      seriesCount.push(i)
    }
  }
  // console.log(chalk.red(seriesCount))
  // check if 2 series are selected
  if (seriesCount.length < 2 || seriesCount.length >= 3) {
    // Render error
    res.status(400).render('error', {
      error: 'You need to select 2 series!',
      page: 'Error!'
    })
    return
  }
  // Put the selected series in vars
  var series1 = seriesList[seriesCount[0]]
  console.log(chalk.yellow(series1))
  var series2 = seriesList[seriesCount[1]]
  console.log(chalk.yellow(series2))

  db.query('UPDATE users SET series1 = ?, series2 = ? WHERE name = ?', [series1, series2, currentUser], done)
  // check if an error ocurred, else: redirect to matchprefs
  function done(err, data) {
    if (err){
      next(err)
    } else {
      // console.log(chalk.green('Series were put in the database'))
      res.redirect('matchprefs')
    }
  }
}

// Add matching preferences
function prefsChosen(req, res) {
  // get current user
  var currentUser = req.session.user.name
  // Get form data and store it in a var
  var agePref = req.body.selectAge
  var genderPref = req.body.gender
  var tagline = req.body.tagline

  db.query('UPDATE users SET genderpref = ?, agepref = ?, tagline = ? WHERE name = ?', [genderPref, agePref, tagline, currentUser], done)
  function done(err, data) {
    if (err) {
      next(err)
    } else {
      res.redirect('index')
    }
  }
}

// register
function register(req, res) {
  // get the contents of the form and put them in variables
  var name = req.body.name
  var email = req.body.email
  var passwd = req.body.password
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
    password: hash,
    tagline: 'No tagline set'
  }, done)
  })
  // check if an error ocurred, else: redirect to /
  function done(err, data) {
    if (err){
      next(err)
    } else {
      req.session.user = {
        name: name,
        email: email
      }
      // console.log(chalk.red(JSON.stringify(req.session.user, null, 4))
      res.redirect('chooseseries')
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
        req.session.user = {
          name: user.name,
          email: email
        }
        // log the session.user object
        // console.log(chalk.red(JSON.stringify(req.session.user, null, 4)))
        res.redirect('index')
      } else {
        // error if the password is incorrect
        res.status(401).send('Incorrect password')
      }
    }
  }
}

// Log out
function logout(req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      next(err)
    } else {
      res.redirect('login')
    }
  })
}

// Remove account
function remove(req, res, next) {
  // Get the current user and email
  var email = req.session.user.email
  var currentUser = req.session.user.name
  var passwd = req.body.password

  if (!passwd) {
    res.status(409).render('error', {
      error: 'Password can not be empty!',
      page: 'Error'
    })
  }

  db.query('SELECT password FROM users WHERE email = ?', email, done)
  function done(err, data) {
    if (err) {
      next(err)
    } else {
      // console.log(chalk.red(JSON.stringify(data, null, 4)))
      console.log(data[0].password)
      // if the email is found, get the password and check if it matches
      bcrypt.compare(passwd, data[0].password).then(onverify, next)
    }
    function onverify(match) {
      if (match) {
        // If password matches delete user
        db.query('DELETE FROM users WHERE email = ?', email, ondelete)
        function ondelete(err, results) {
          if (err) {
            next(err)
          } else {
            res.redirect('welcome')
          }
        }
      } else {
        // error if the password is incorrect
        res.status(401).render('error', {
          error: 'Incorrect password..',
          page: 'Error!'
        })
      }
    }
  }
}

//xmlhttprequest
function xhr(req, res, next) {
  db.query('SELECT email FROM users', done)
  function done(err, data) {
    if(err) {
      next(err)
    } else {
      res.send(data)
      // console.log(chalk.red(JSON.stringify(data, null, 4)))
    }
  }
}

// handle 'couldn't get ... requests'
function notFound(req, res) {
  res.status(404).render('error', {
    error: '404 Not found. We could not find this page :(',
    page: 'Error!'
  })
}
