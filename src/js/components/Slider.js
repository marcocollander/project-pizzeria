/* global Handlebars */
'use strict';
let index = 0;
let indexIcons = 0;

function slider() {
  let targetElement;
  const templateSlide = Handlebars.compile(document.getElementById('template-slide').innerHTML);

  const quoteOne = {
    title: 'Dura lex sed lex!',
    quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ante tortor, hendrerit in consectetur a, suscipit fermentum magna. Donec eros sem,',
    author: 'Marcus Tulius Cicero '
  };

  const quoteTwo = {
    title: 'Veni vidi vici!',
    quote: 'Sed dictum convallis suscipit. Etiam dui tellus, ullamcorper viverra metus convallis, laoreet blandit erat. Phasellus malesuada libero nec erat vehicula ornare.',
    author: 'Gaius Julius Ceazar'
  };

  const quoteThree = {
    title: 'Labor omnia vincit',
    quote: 'Vivamus aliquet magna in suscipit suscipit. Aliquam tincidunt, est sit amet sagittis pulvinar, elit enim blandit lectus, et pharetra diam erat vitae tortor',
    author: 'Zina Marcus Collander'
  };

  targetElement = document.querySelector('.carousel');
  const quotes = [];

  quotes.push(quoteOne);
  quotes.push(quoteTwo);
  quotes.push(quoteThree);

  for (let quote of quotes) {
    const generatedHTML = templateSlide(quote);
    targetElement.insertAdjacentHTML('beforeend', generatedHTML);
  }

  const wrappers = targetElement.querySelectorAll('.slide');
  const icons = document.querySelectorAll('.slide-icon i');

  for (let i = 0; i < wrappers.length; i++) {
    wrappers[i].style.display = 'none';

  }

  for (let i = 0; i < icons.length; i++) {
    icons[i].classList.remove('fas');
    icons[i].classList.add('far');
  }

  index++;
  indexIcons++;
  if (index > wrappers.length) {
    index = 1;
  }

  if (indexIcons > icons.length) {
    indexIcons = 1;
  }
  
  icons[indexIcons - 1].classList.remove('far');
  wrappers[index - 1].style.display = 'block';
  setTimeout(slider, 3000);
  icons[indexIcons - 1].classList.add('fas');
}

slider();








