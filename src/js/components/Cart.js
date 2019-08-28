import { settings, select, classNames, templates } from '../settings.js';
import { utils } from '../utils.js';
import { CartProduct } from './CartProduct.js';

export class Cart {
  constructor(element) {
    const thisCart = this;
    thisCart.products = [];
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;

    thisCart.getElements(element);
    thisCart.initActions();
  }

  getElements(element) {
    const thisCart = this;
    thisCart.dom = {};
    thisCart.dom.wrapper = element;

    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(
      select.cart.toggleTrigger
    );

    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(
      select.cart.productList
    );

    thisCart.renderTotalsKeys = [
      'totalNumber',
      'totalPrice',
      'subtotalPrice',
      'deliveryFee'
    ];

    for (let key of thisCart.renderTotalsKeys) {
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(
        select.cart[key]
      );
    }

    thisCart.dom.from = thisCart.dom.wrapper.querySelector(
      select.cart.form
    );

    thisCart.phone = thisCart.dom.wrapper.querySelector(
      select.cart.phone
    );

    thisCart.address = thisCart.dom.wrapper.querySelector(
      select.cart.address
    );
  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      thisCart.dom.wrapper.classList.toggle(
        classNames.cart.wrapperActive
      );
    });

    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function () {
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.from.addEventListener('submit', function (event) {
      event.preventDefault();

      thisCart.sendOrder();
    });
  }

  add(menuProduct) {
    const thisCart = this;
    const generatedHTML = templates.cartProduct(menuProduct);
    const generateDom = utils.createDOMFromHTML(generatedHTML);

    thisCart.dom.productList.appendChild(generateDom);
    thisCart.products.push(
      new CartProduct(
        menuProduct, generateDom
      )
    );
    thisCart.update();
  }

  update() {
    const thisCart = this;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for (let product of thisCart.products) {
      thisCart.subtotalPrice += product.price;
      thisCart.totalNumber += product.amount;
    }

    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;

    for (let key of thisCart.renderTotalsKeys) {
      for (let elem of thisCart.dom[key]) {
        elem.innerHTML = thisCart[key];
      }
    }
  }

  remove(cartProduct) {
    const thisCart = this;
    const index = thisCart.products.indexOf(cartProduct);

    thisCart.products.splice(index, 1);
    cartProduct.dom.wrapper.remove();
    thisCart.update();
  }

  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      phone: thisCart.phone.value,
      address: thisCart.address.value,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      totalPrice: thisCart.totalPrice,
      deliveryFee: thisCart.deliveryFee,
      products: []
    };

    for (let product of thisCart.products) {
      payload.products.push(product.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function (response) {
        return response.json();
      });
  }
}