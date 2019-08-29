import { Product } from './components/Products.js';
import { Cart } from './components/Cart.js';
import { select, settings, classNames } from './settings.js';

const app = {
  initData: function () {
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        thisApp.data.products = parsedResponse;
        thisApp.initMenu();
      });
  },

  initMenu: function () {
    const thisApp = this;

    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initCart: function () {
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);
    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },

  init: function () {
    const thisApp = this;

    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
  },

  initPages: function() {
    const thisApp = this;
    console.log(select.containerOf.pages);
    thisApp.pages = Array.from(document.querySelector(select.containerOf.pages).children);
    console.log(thisApp.pages);
    thisApp.navLinks = Array.from(document.querySelectorAll(select.nav.links));
    console.log(thisApp.navLinks);
    thisApp.activatePage(thisApp.pages[0].id);
    console.log(thisApp.pages[0].id);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        const clickedElement = this;
        const href = clickedElement.getAttribute('href');
        console.log(href);
        const id = href.replace('#', '');
        console.log('id: ', id);
       
        console.log('function: ', thisApp.activatePage(id));
      });
    }
  },

  activatePage: function(pageId) {
    const thisApp = this;

    for (let link of thisApp.navLinks) {
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
    }

    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.nav.active, page.getAttribute('id') == pageId);
    }
  }

};

app.init();


