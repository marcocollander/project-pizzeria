{
  'use strict';
  let index = 0;

  slider();

  function slider() {
    const quotes = document.querySelectorAll('.slide');
    const icons = document.querySelectorAll('.slide-icon i');

    for (let i = 0; i < quotes.length; i++) {
      quotes[i].style.display = 'none';
      icons[i].classList.remove('fas');
      icons[i].classList.add('far');
    }

    index++;
    if (index > quotes.length) {
      index = 1;
    }
    
    icons[index -1].classList.remove('far');
    quotes[index - 1].style.display = 'block';
    setTimeout(slider, 3000);
    icons[index - 1].classList.add('fas');
  }
}