import refs from "./refs";
import {error, alert, defaultModules } from '@pnotify/core';
import * as PNotifyMobile from '@pnotify/mobile';
import countryMarkup from '../templates/country.hbs'

defaultModules.set(PNotifyMobile, {});

let debounce = require('lodash.debounce');

let {inputRef, countryInfo, countryTotal} = refs

class Country {
  constructor(url) {
    this.getCountry = inputRef;
    this.country = '';
    this.url = url;
  }
  init () {
    this.getCountry.addEventListener('input', debounce(this.search, 500))


  }
  search = (event) => {
    this.country = event.target.value.toLowerCase();

    if (this.country === '' || !isNaN(this.country)) {
      countryInfo.innerHTML = '';
      countryTotal.innerHTML = '';
      alert({
        text: 'Enter your country '
      })
    } else {
      this.newFetch();
    }
  }

  newFetch = () => {
    fetch(this.url + this.country).then(res => res.json())
      .then(data => {
        if (data.status === 404) {
          error({
            text: 'Error!'
          })
        }
        this.getContent(data)
      })
      .catch(errorMSG => {
        error({
          text: 'Promise error!!'
        })
    })
  }

  getContent = (data) => {
    if (data.length === 1) {
      countryTotal.innerHTML = countryMarkup(data);
      return
    }
    if (data.length === 2 && data.length < 10) {
      data.forEach(country => {
        countryInfo.insertAdjacentHTML('beforeend', `<h3 class="countryName">${country.name}</h3>`)
      })
      return
    }
    if (data.length > 10) {
      alert({
        text: 'Specify your country more precisely!'
      })
    }

  }


}

let country = new Country('https://restcountries.eu/rest/v2/name/');
country.init();


