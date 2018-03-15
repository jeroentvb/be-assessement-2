/*jslint browser: true, devel: true, eqeq: true, plusplus: true, sloppy: true, vars: true, white: true*/

var menuBtn = document.querySelector('#menuBtn');
var menu = document.querySelector('#hamburgerMenu');
var closeMenu = document.querySelector('#closeMenu');

function showMenu() {
  menu.classList.add('showMenu');
  menu.classList.remove('hideMenu');
}

function hideMenu() {
  menu.classList.remove('showMenu');
  menu.classList.add('hideMenu');
}



menuBtn.addEventListener('click', showMenu);

closeMenu.addEventListener('click', hideMenu);
