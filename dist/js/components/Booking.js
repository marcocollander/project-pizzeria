import { templates, select, settings, classNames } from '../settings.js';
import { utils } from '../utils.js';
import { AmountWidget } from './AmountWidget.js';
import { DatePicker } from './DatePicker.js';
import { HourPicker } from './HourPicker.js';

export class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.initActions();
  }

  render(paramElem) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = paramElem;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form);
    thisBooking.dom.slider = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.slider);
  }

  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDOM();
    });

  }

  getData() {
    const thisBooking = this;
    thisBooking.selectedTable;
    const startEndDates = {};
    startEndDates[settings.db.dateStartParamKey] = utils.dateToStr(thisBooking.datePicker.minDate);
    startEndDates[settings.db.dateEndParamKey] = utils.dateToStr(thisBooking.datePicker.maxDate);

    const endDate = {};
    endDate[settings.db.dateEndParamKey] = startEndDates[settings.db.dateEndParamKey];

    const params = {
      booking: utils.queryParams(startEndDates),
      eventsCurrent: settings.db.notRepeatParam + '&' + utils.queryParams(startEndDates),
      eventsRepeat: settings.db.repeatParam + '&' + utils.queryParams(endDate),
    };

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking,
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent,
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat,
    };

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function ([bookingsResponse, eventsCurrentResponse, eventsRepeatResponse]) {
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;
    thisBooking.booked = {};

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let eventCurrent of eventsCurrent) {
      thisBooking.makeBooked(eventCurrent.date, eventCurrent.hour, eventCurrent.duration, eventCurrent.table);
    }

    for (let booking of bookings) {
      thisBooking.makeBooked(booking.date, booking.hour, booking.duration, booking.table);
    }

    for (let eventRepeat of eventsRepeat) {
      if (eventRepeat.repeat == 'daily') {
        for (let dayStart = minDate; dayStart <= maxDate; dayStart = utils.addDays(dayStart, 1)) {
          thisBooking.makeBooked(utils.dateToStr(dayStart), eventRepeat.hour, eventRepeat.duration, eventRepeat.table);
        }
      }
    }


  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;
    const startHour = utils.hourToNumber(hour);

    if (thisBooking.booked[date] === undefined) {
      thisBooking.booked[date] = {};
    }

    for (let i = startHour; i < startHour + duration; i += 0.5) {
      if (thisBooking.booked[date][i] === undefined) {
        thisBooking.booked[date][i] = [];
      }

      thisBooking.booked[date][i].push(table);
    }
    //this.colored(thisBooking.booked);
  }

  updateDOM() {
    const thisBooking = this;
    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);

      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (
        thisBooking.booked[thisBooking.date] !== undefined &&
        thisBooking.booked[thisBooking.date][thisBooking.hour] !== undefined &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)

      ) {
        table.classList.add(classNames.booking.tableBooked);
      }
      else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }

    const hours = [];

    for (let i = 0; i < 24; i++) {
      hours[i] = 12 + 0.5 * i;
    }

    let interval = 100 / 24;
    let gradient = ``;
    const green = [];
    const red = [];
    const orange = [];

    console.log(thisBooking.booked);
    console.log(thisBooking.booked[thisBooking.date]);

    for (let hour in thisBooking.booked[thisBooking.date]) {
      if (thisBooking.booked[thisBooking.date][hour].length === 1) {
        green.push(hour);
      }
      else if (thisBooking.booked[thisBooking.date][hour].length === 2) {
        orange.push(hour);
      }
      else if (thisBooking.booked[thisBooking.date][hour].length === 3) {
        red.push(hour);
      }

      console.log(green.length);
      console.log(orange.length);      
      console.log(red.sort.length);      

      thisBooking.dom.slider.style.background = `linear-gradient(to right, rgb(0, 255, 0) ${green.length}%, rgb(255, 120, 0) ${2 * orange.length}%, rg(250, 0, 0) ${3 * red.length}%)`;
    }
  }

  initActions() {
    const thisBooking = this;
    let nameTable;
    for (let table of thisBooking.dom.tables) {

      table.addEventListener('click', function () {
        table.classList.add(classNames.booking.tableBooked);
        nameTable = table.innerHTML.slice(6, 7);
        thisBooking.selectedTable = parseInt(nameTable);
        console.log(thisBooking.selectedTable);
      });
    }

    thisBooking.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisBooking.sendBooking();
    });


  }

  sendBooking() {
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;

    const payload = {
      date: thisBooking.datePicker.value,
      table: thisBooking.selectedTable,
      hour: thisBooking.hourPicker.value,
      repeat: false,
      duration: thisBooking.hoursAmount.value,
      ppl: thisBooking.peopleAmount.value
    };

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

    thisBooking.makeBooked(payload.date, payload.hour, payload.duration, payload.table);
  }
}