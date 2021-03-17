import refs from "./refs";
import { alert, defaultModules } from '@pnotify/core';
import * as PNotifyMobile from '@pnotify/mobile';
import countryMarkup from '../templates/country.hbs'

defaultModules.set(PNotifyMobile, {});

let debounce = require('lodash.debounce');

let {inputRef, countryInfo, countryTotal} = refs

class Country {
  constructor(inputRef) {
    this.getCountry = inputRef;
    this.country = '';
  }
  init () {
    this.getCountry.addEventListener('input', debounce(this.search, 500))


  }


  search (event) {
    this.country = event.target.value.toLowerCase();
    if (!isNaN(this.country)) {
      alert({
        text: `Set Country name!`
      })
      return
    }
    if (this.country === '') {
      countryInfo.innerHTML = '';
      countryTotal.innerHTML = '';
    } else {
      fetch('https://restcountries.eu/rest/v2/name/' + this.country)
        .then(res => res.json(res))
        .then(data => {
          if (data.length === 2 && data.length < 10) {
            data.forEach(country => {
              countryInfo.insertAdjacentHTML('beforeend', `<h3 class="countryName">${country.name}</h3>`)
            })
          }
          if (data.length > 10) {
            alert({
              text: 'Вкажіть вашу країну більш конкретно!'
            })
          }
          if (data.length === 1) {
            countryTotal.innerHTML = countryMarkup(data);
          }
        })
    }
  }




}

let country = new Country(inputRef);
country.init();


