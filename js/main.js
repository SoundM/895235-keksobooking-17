'use strict';

// Активация страницы от перемещения mapPinMain на карте
(function () {

  var adForm = document.querySelector('.ad-form');
  var adFormInputsSelects = adForm.querySelectorAll('input, select');

  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters');
  var mapFiltersInputsSelects = mapFilters.querySelectorAll('input, select');
  var PIN_MAIN_WIDTH = 65;
  var PIN_MAIN_HEIGHT = 87;
  var widthMap = document.querySelector('.map').offsetWidth;
  var MAP_MIN_HEIGHT = 130;
  var MAP_MAX_HEIGHT = 630;
  var inputAddress = adForm.querySelector('#address');
  var pageIsActive = false;
  var mapPinMain = map.querySelector('.map__pin--main');

  var startCoords = { // Начальные координаты точки курсора, с которой мы начали перемещать пин
    x: 0,
    y: 0
  };

  // Функция активации страницы
  var getActivePage = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    window.unsetDisabled(adFormInputsSelects);
    window.unsetDisabled(mapFiltersInputsSelects);
  };

  // Функция получения координат острого конца Главного Пина
  var getPinMainCoordinates = function () { // https://developer.mozilla.org/ru/docs/Web/API/Element/getBoundingClientRect
    var mapCoordinates = map.getBoundingClientRect();
    var pinMainCoordinates = mapPinMain.getBoundingClientRect();
    var pinMainLeft = Math.floor(pinMainCoordinates.left - mapCoordinates.left + PIN_MAIN_WIDTH / 2);
    var pinMainTop = Math.floor(pinMainCoordinates.top - mapCoordinates.top + PIN_MAIN_HEIGHT);
    inputAddress.value = pinMainLeft + ', ' + pinMainTop;
  };

  // Функция обработчика события нажатия мышки
  var onMouseDown = function (evtMouseDown) {
    evtMouseDown.preventDefault();
    startCoords = { // Координаты точки, с которой мы начали перемещать пин
      x: evtMouseDown.clientX,
      y: evtMouseDown.clientY
    };
    return startCoords;
  };

  // Функция вычисления координат от смещения
  var onMouseMove = function (evtMouseMove) {
    evtMouseMove.preventDefault();

    var shift = {
      x: startCoords.x - evtMouseMove.clientX,
      y: startCoords.y - evtMouseMove.clientY
    };

    startCoords = {
      x: evtMouseMove.clientX,
      y: evtMouseMove.clientY
    };

    mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
    mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';

    var curX = (mapPinMain.offsetLeft - shift.x) + Math.ceil(PIN_MAIN_WIDTH / 2);
    var curY = (mapPinMain.offsetTop - shift.y) + PIN_MAIN_HEIGHT;

    // здесь мы проверям не вынесли ли пин за границы карты
    if (curX <= 0) {
      mapPinMain.style.left = (-1) * Math.floor(PIN_MAIN_WIDTH / 2) + 'px';
    }

    if (curX >= widthMap) {
      mapPinMain.style.left = Math.ceil(widthMap - PIN_MAIN_WIDTH / 2) + 'px';
    }

    if (curY <= MAP_MIN_HEIGHT) {
      mapPinMain.style.top = MAP_MIN_HEIGHT - PIN_MAIN_HEIGHT + 'px';
    }

    if (curY >= MAP_MAX_HEIGHT) {
      mapPinMain.style.top = MAP_MAX_HEIGHT - PIN_MAIN_HEIGHT + 'px';
    }

    getPinMainCoordinates();
    pageIsActive = true;
  };

  var counter = 0;

  // Функция сброса обработчика события движения и отпускания мыши
  var onMouseUp = function (evtMouseUp) {
    evtMouseUp.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);


    if (pageIsActive) {
      var onClickPreventDefault = function (moveEvt) {
        moveEvt.preventDefault();
        getActivePage();
        if (counter === 0) {
          window.backend.load(window.filter.successHandler, window.backend.errorHandler);
          counter++;
        }
        mapPinMain.removeEventListener('click', onClickPreventDefault);
      };
      counter = counter;
      mapPinMain.addEventListener('click', onClickPreventDefault);
    }
  };

  mapPinMain.addEventListener('mousedown', function (evtMouseDown) { // обработаем событие начала перетаскивания mousedown.
    evtMouseDown.preventDefault();
    onMouseDown(evtMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.main = {
    adForm: adForm,
    adFormInputsSelects: adFormInputsSelects,
    mapFiltersInputsSelects: mapFiltersInputsSelects,
    map: map,
    mapPinMain: mapPinMain,
    getActivePage: getActivePage
  };

})();
