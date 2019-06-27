'use strict';

(function () {

  var adForm = document.querySelector('.ad-form');
  var adFormInputsSelects = adForm.querySelectorAll('input, select');


  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters');
  var mapFiltersInputsSelects = mapFilters.querySelectorAll('input, select');


  // Функция расстановки disabled для input и select в форме
  var setDisabled = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].setAttribute('disabled', 'disabled');
    }
  };

  // Функция снятия disabled
  var unsetDisabled = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].removeAttribute('disabled');
    }
  };

  setDisabled(adFormInputsSelects);
  setDisabled(mapFiltersInputsSelects);

  // Функция активации страницы
  var getActivePage = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    unsetDisabled(adFormInputsSelects);
    unsetDisabled(mapFiltersInputsSelects);
  };

  window.main = {
    adForm: document.querySelector('.ad-form'),
    adFormInputsSelects: adForm.querySelectorAll('input, select'),
    map: document.querySelector('.map'),
    mapPinMain: map.querySelector('.map__pin--main'),
    getActivePage: getActivePage
  };

})();
