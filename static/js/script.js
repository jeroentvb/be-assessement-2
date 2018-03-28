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
  // var main = document.querySelector('main');


  for (var i=0; i < dislikeBtn.length; i++) {
    var dislike = function () {
      this.remove();
    };
    dislikeBtn[i].addEventListener('click', dislike);
  }

  var like = function () {
    window.alert('It is a match!');
    this.remove();
  };

  for (var i=0; i < likeBtn.length; i++) {
    likeBtn[i].addEventListener('click', like);
  }

  // var checkArticles = function () {
  //   var articleAmount = personCard.length;
  //   if (articleAmount <= 0) {
  //     main.innerHTML = '<h2>No matches left for today.</h2><h2>Come back tomorrow</h2>';
  //   }
  // }
}

// Back button
if (document.getElementById('backBtn') !== null) {
  var backBtn = document.querySelector('#backBtn');

  backBtn.addEventListener('click', function(event) {
    event.preventDefault();
    window.history.back();
  });
}
