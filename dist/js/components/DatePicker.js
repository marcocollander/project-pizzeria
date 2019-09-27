/* global flatpickr */

import { settings, select } from '../settings.js';
import { utils } from '../utils.js';
import { BaseWidget } from './BaseWidget.js';

export class DatePicker extends BaseWidget {
  constructor(wrapper) {
    super(wrapper, utils.dateToStr(new Date()));

    const thisWidget = this;
    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapper;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(
      select.widgets.datePicker.input
    );

    thisWidget.initPlugin();
    console.log(thisWidget);
  }

  isValid() {
    return true;
  }

  initPlugin() {
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);
    console.log(typeof thisWidget.value);
    console.log(thisWidget.value);

    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate,

      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,

      disable: [
        function (date) {
          return date.getDay() === 1;
        }
      ],

      locale: {
        firstDayOfWeek: 1
      },

      onChange: function (dateStr) {
        console.log(dateStr[0]);
        let dateChange = utils.addDays(dateStr, 1);
        console.log(utils.addDays(dateStr, 1));
        console.log(utils.dateToStr(dateChange));
        thisWidget.value = utils.dateToStr(dateChange);
      },
    });
  }
}  