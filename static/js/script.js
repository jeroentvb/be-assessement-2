/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/

// Mobile menu
if (document.getElementById('hamburgerMenu') !== null) {
  var menuBtn = document.querySelector('#menuBtn');
  var menu = document.querySelector('#hamburgerMenu');
  var closeMenu = document.querySelector('#closeMenu');

  var showMenu = function() {
    menu.classList.add('showMenu');
    menu.classList.remove('hideMenu');
  };
  var hideMenu = function() {
    menu.classList.remove('showMenu');
    menu.classList.add('hideMenu');
  };

  menuBtn.addEventListener('click', showMenu);
  closeMenu.addEventListener('click', hideMenu);
}

// Like/dislike buttons
if (document.getElementsByClassName('likeDislikeButtons')[0] !== undefined) {
  var dislikeBtn = document.querySelectorAll('.dislike');
  var likeBtn = document.querySelectorAll('.like');
  var personCard = document.querySelectorAll('.personCard');
  var main = document.querySelector('main');

  // Dislike button
  for (var i=0; i < dislikeBtn.length; i++) {
    var dislike = function () {
      this.parentNode.parentNode.parentNode.remove();
      checkArticles();
    };
    dislikeBtn[i].addEventListener('click', dislike);
  }

  // Likebutton
  for (var i=0; i < likeBtn.length; i++) {
    var like = function () {
      window.alert('It is a match!');
      this.parentNode.parentNode.parentNode.remove();
      checkArticles();
    };
    likeBtn[i].addEventListener('click', like);
  }

  // Check if there are <= 0 articles
  var checkArticles = function () {
    var articleAmount = document.querySelectorAll('.personCard').length;
    if (articleAmount <= 0) {
      main.innerHTML = '<h2>No matches left for today.</h2><h2>Come back tomorrow.</h2><p>Go <a href="chatlist">chat</a> with your matches</p>';
    }
  }
}

// Back button
if (document.getElementById('backBtn') !== null) {
  var backBtn = document.querySelector('#backBtn');

  backBtn.addEventListener('click', function(event) {
    event.preventDefault();
    window.history.back();
  });
}
