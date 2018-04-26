/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/

// Mobile menu
if (document.getElementById('hamburgerMenu') !== null) {
  var menuBtn = document.querySelector('#menuBtn')
  var menu = document.querySelector('#hamburgerMenu')
  var closeMenu = document.querySelector('#closeMenu')

  var showMenu = function() {
    menu.classList.add('showMenu')
    menu.classList.remove('hideMenu')
  }
  var hideMenu = function() {
    menu.classList.remove('showMenu')
    menu.classList.add('hideMenu')
  }

  menuBtn.addEventListener('click', showMenu)
  closeMenu.addEventListener('click', hideMenu)
} else {
  var menuBtn = document.querySelector('#menuBtn')
  var chatlistIcon = document.querySelector('#chatlistIcon')
  var nav = document.querySelector('nav')
  menuBtn.style.display = "none"
  chatlistIcon.style.display = "none"
  nav.style.padding = '0.8em 0'
}

// Like/dislike buttons
if (document.getElementsByClassName('likeDislikeButtons')[0] !== undefined) {
  var dislikeBtn = document.querySelectorAll('.dislike')
  var likeBtn = document.querySelectorAll('.like')
  var personCard = document.querySelectorAll('.personCard')
  var main = document.querySelector('main')

  // Dislike button
  for (var i=0; i < dislikeBtn.length; i++) {
    var dislike = function () {
      if (confirm('Do you really want to dislike this person?')) {
        this.parentNode.parentNode.parentNode.remove()
        checkArticles()
      }
    }
    dislikeBtn[i].addEventListener('click', dislike)
  }

  // Likebutton
  for (var i=0; i < likeBtn.length; i++) {
    var like = function () {
      window.alert('It is a match!')
      this.parentNode.parentNode.parentNode.remove()
      checkArticles()
    }
    likeBtn[i].addEventListener('click', like)
  }

  // Check if there are <= 0 articles
  var checkArticles = function () {
    var articleAmount = document.querySelectorAll('.personCard').length
    if (articleAmount <= 0) {
      main.innerHTML = '<h2>No matches left for today.</h2><h2>Come back tomorrow.</h2><p>Go <a href="chatlist">chat</a> with your matches</p>'
    }
  }
}

// Back button
if (document.getElementById('backBtn') !== null) {
  var backBtn = document.querySelector('#backBtn')

  backBtn.addEventListener('click', function(event) {
    event.preventDefault()
    window.history.back()
  })
}

// check Email
var path = window.location.pathname
// Check if the register page is loaded, otherwise don't use this bit of code
if (path == '/register' || path == '/register.html') {
  var button = document.querySelector('#check')
  var p = document.querySelector('#emailUsed')

  button.addEventListener('click', checkEmail)
  // Check if email exists in the database function
  function checkEmail() {
    var email = document.querySelector('#email').value
    // Show an error if there's no email entered
    if(email <= 6) {
      p.innerHTML = 'You entered an incomplete e-mail adress.'
    } else {
      // Do a server request
      // Source: https://www.youtube.com/watch?v=h0ZUpPiV1ac
      var res = new XMLHttpRequest()
      res.onreadystatechange = function() {
        // if everything is ok, process the data
        if(res.readyState == 4 && res.status == 200) {
          var emailAdresses = JSON.parse(res.response)
          // Loop through the email adresses and check if there's one that matches
          for(let i=0; i < emailAdresses.length; i++) {
            if(emailAdresses[i].email == email){
              p.innerHTML = 'The e-mail adress has already been used.'
              // Stop the loop
              break
            } else {
              p.innerHTML = 'The e-mail adress has not been used.'
            }
          }
        }
      }
      res.open('GET', '/xhr')
      res.send()
    }
  }
  // Check if the confirm fields are the same as the actual ones
  var submit = document.querySelector('#submit')

  submit.addEventListener('click', function(event) {
    var email = document.querySelector('#email').value
    var confirmEmail = document.querySelector('#confirmEmail').value
    var password = document.querySelector('#passwd').value
    var confirmPassword = document.querySelector('#confirmPasswd').value
    var warning = document.querySelector('#warning')

    if (email == '' || confirmEmail == '' || password == '' || confirmPassword == '') {
      event.preventDefault()
      warning.innerHTML = 'You need to fill in all the fields.'
    } else if (email != confirmEmail) {
      event.preventDefault()
      warning.innerHTML = 'Email does not match the confirmed email.'
    } else if (password != confirmPassword) {
      event.preventDefault()
      warning.innerHTML = 'Password does not match the confirmed password.'
    }
  })
}

// First time view index
if (path == '/firstregister' || path == '/firstregister.html') {
  window.onload = onload
  function onload() {
    window.alert('Welcome to WatchTogether!\nOn this page you can find 3 potential matches every day.\nIf you tap on a heart, a chat will be opened with the person in the card. We encourage you plan a date and watch a series together.')
  }
}
