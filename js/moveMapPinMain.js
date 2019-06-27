'use strict';
// Перемещение mapPinMain на карте

// функция для записи координат указателя пина mapPinMain в поле с адресом
// Функция получения координат острого конца Главного Пина
(function () {

  var PIN_MAIN_WIDTH = 65;
  var PIN_MAIN_HEIGHT = 87;
  var widthMap = document.querySelector('.map').offsetWidth;
  var MAP_MIN_HEIGHT = 130;
  var MAP_MAX_HEIGHT = 630;
  var inputAddress = window.main.adForm.querySelector('#address');
  var pageIsActive = false;

  var startCoords = { // Начальные координаты точки курсора, с которой мы начали перемещать пин
    x: 0,
    y: 0
  };
  var getPinMainCoordinates = function () { // https://developer.mozilla.org/ru/docs/Web/API/Element/getBoundingClientRect
    var mapCoordinates = window.main.map.getBoundingClientRect();
    var pinMainCoordinates = window.main.mapPinMain.getBoundingClientRect();
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

    window.main.mapPinMain.style.left = (window.main.mapPinMain.offsetLeft - shift.x) + 'px';
    window.main.mapPinMain.style.top = (window.main.mapPinMain.offsetTop - shift.y) + 'px';

    var curX = (window.main.mapPinMain.offsetLeft - shift.x) + Math.ceil(PIN_MAIN_WIDTH / 2);
    var curY = (window.main.mapPinMain.offsetTop - shift.y) + PIN_MAIN_HEIGHT;

    // здесь мы проверям не вынесли ли пин за границы карты
    if (curX <= 0) {
      window.main.mapPinMain.style.left = (-1) * Math.floor(PIN_MAIN_WIDTH / 2) + 'px';
    }

    if (curX >= widthMap) {
      window.main.mapPinMain.style.left = Math.ceil(widthMap - PIN_MAIN_WIDTH / 2) + 'px';
    }

    if (curY <= MAP_MIN_HEIGHT) {
      window.main.mapPinMain.style.top = MAP_MIN_HEIGHT - PIN_MAIN_HEIGHT + 'px';
    }

    if (curY >= MAP_MAX_HEIGHT) {
      window.main.mapPinMain.style.top = MAP_MAX_HEIGHT - PIN_MAIN_HEIGHT + 'px';
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
        window.main.getActivePage();
        if (counter === 0) {
          window.renderOffers();
          counter++;
        }
        window.main.mapPinMain.removeEventListener('click', onClickPreventDefault);
      };
      counter = counter;
      window.main.mapPinMain.addEventListener('click', onClickPreventDefault);
    }
  };

  window.main.mapPinMain.addEventListener('mousedown', function (evtMouseDown) { // обработаем событие начала перетаскивания mousedown.
    evtMouseDown.preventDefault();
    onMouseDown(evtMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
