let menu = document.querySelector('#menu');
let main = document.querySelector('main');
let drawer = document.querySelector('.nav');

menu.addEventListener('click', function (e) {
  drawer.classList.toggle('open');
  e.stopPropagation();
});

main.addEventListener('click', function () {
  drawer.classList.remove('open');
});