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
  var dislikeBtn = document.querySelector('.dislike');
  var likeBtn = document.querySelector('.like');
  var firstArticle = document.querySelector('#firstArticle');

  dislikeBtn.addEventListener('click', function() {
    firstArticle.innerHTML = '';
  });
  likeBtn.addEventListener('click', function() {
    window.alert('It is a match!');
  });
}

// Back button
if (document.getElementById('backBtn') !== null) {
  var backBtn = document.querySelector('#backBtn');

  backBtn.addEventListener('click', function(event) {
    event.preventDefault();
    window.history.back();
  });
}
