'use strict';

// Активация страницы от перемещения mapPinMain на карте
(function () {
  var PIN_MAIN_WIDTH = 65;
  var PIN_MAIN_HEIGHT = 87;
  var MAP_MIN_HEIGHT = 130;
  var MAP_MAX_HEIGHT = 630;
  var StartCoordinates = { // Начальные координаты точки курсора, с которой мы начали перемещать пин
    x: 0,
    y: 0
  };
  var counter = 0;

  var adForm = document.querySelector('.ad-form');
  var adFormInputsSelects = adForm.querySelectorAll('input, select, textarea, button');
  var map = document.querySelector('.map');
  var mapFilters = map.querySelector('.map__filters');
  var mapFiltersInputsSelects = mapFilters.querySelectorAll('input, select');
  var widthMap = document.querySelector('.map').offsetWidth;
  var inputAddress = adForm.querySelector('#address');
  var pageIsActive = false;
  var mapPin = map.querySelector('.map__pin--main');
  var mapPinButton = map.querySelector('button.map__pin--main');


  // Функция активации страницы
  var getActivePage = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    window.form.unsetDisabled(adFormInputsSelects);
    window.form.unsetDisabled(mapFiltersInputsSelects);
  };

  var checkDataLoaded = function () {
    if (counter === 0) {
      window.backend.load(window.filter.onSuccess, window.backend.onErrorShowMessage);
      counter++;
    }
    window.filter.getFirstOffers();
  };

  // Функция получения координат острого конца Главного Пина
  var getPinMainCoordinates = function () { // https://developer.mozilla.org/ru/docs/Web/API/Element/getBoundingClientRect
    var mapCoordinates = map.getBoundingClientRect();
    var pinMainCoordinates = mapPin.getBoundingClientRect();
    var pinMainLeft = Math.floor(pinMainCoordinates.left - mapCoordinates.left + PIN_MAIN_WIDTH / 2);
    var pinMainTop = Math.floor(pinMainCoordinates.top - mapCoordinates.top + PIN_MAIN_HEIGHT);
    inputAddress.value = pinMainLeft + ', ' + pinMainTop;
  };

  // Функция обработчика события нажатия мышки
  var onMouseDown = function (evtMouseDown) {
    evtMouseDown.preventDefault();
    StartCoordinates = { // Координаты точки, с которой мы начали перемещать пин
      x: evtMouseDown.clientX,
      y: evtMouseDown.clientY
    };
    return StartCoordinates;
  };

  // Функция вычисления координат от смещения
  var onMouseMove = function (evtMouseMove) {
    evtMouseMove.preventDefault();

    var shift = {
      x: StartCoordinates.x - evtMouseMove.clientX,
      y: StartCoordinates.y - evtMouseMove.clientY
    };

    StartCoordinates = {
      x: evtMouseMove.clientX,
      y: evtMouseMove.clientY
    };

    mapPin.style.left = (mapPin.offsetLeft - shift.x) + 'px';
    mapPin.style.top = (mapPin.offsetTop - shift.y) + 'px';

    var curX = (mapPin.offsetLeft - shift.x) + Math.ceil(PIN_MAIN_WIDTH / 2);
    var curY = (mapPin.offsetTop - shift.y) + PIN_MAIN_HEIGHT;

    // здесь мы проверям не вынесли ли пин за границы карты
    if (curX <= 0) {
      mapPin.style.left = (-1) * Math.floor(PIN_MAIN_WIDTH / 2) + 'px';
    }

    if (curX >= widthMap) {
      mapPin.style.left = Math.ceil(widthMap - PIN_MAIN_WIDTH / 2) + 'px';
    }

    if (curY <= MAP_MIN_HEIGHT) {
      mapPin.style.top = MAP_MIN_HEIGHT - PIN_MAIN_HEIGHT + 'px';
    }

    if (curY >= MAP_MAX_HEIGHT) {
      mapPin.style.top = MAP_MAX_HEIGHT - PIN_MAIN_HEIGHT + 'px';
    }

    getPinMainCoordinates();
    pageIsActive = true;
  };

  // Функция сброса обработчика события движения и отпускания мыши
  var onMouseUp = function (evtMouseUp) {
    evtMouseUp.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);


    if (pageIsActive) {
      var onPreventDefaultClick = function (moveEvt) {
        moveEvt.preventDefault();
        getActivePage();
        checkDataLoaded();
        mapPin.removeEventListener('click', onPreventDefaultClick);
      };
      mapPin.addEventListener('click', onPreventDefaultClick);
    }
  };

  mapPin.addEventListener('mousedown', function (evtMouseDown) { // обработаем событие начала перетаскивания mousedown.
    evtMouseDown.preventDefault();
    onMouseDown(evtMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Активация страницы по enter
  var onMapPinButtonEnterPress = function (evt) {
    window.util.isEnterEvent(evt, onActivePageOpen);
  };

  var onActivePageOpen = function () {
    getActivePage();
    getPinMainCoordinates();
    checkDataLoaded();
    mapPinButton.removeEventListener('keydown', onMapPinButtonEnterPress);
  };

  mapPinButton.addEventListener('keydown', onMapPinButtonEnterPress);

  window.main = {
    adForm: adForm,
    adFormInputsSelects: adFormInputsSelects,
    mapFiltersInputsSelects: mapFiltersInputsSelects,
    map: map,
    mapPin: mapPin,
    mapPinButton: mapPinButton,
    onMapPinButtonEnterPress: onMapPinButtonEnterPress,
    getActivePage: getActivePage,
    getPinMainCoordinates: getPinMainCoordinates
  };

})();
