'use strict';

var NUMBER_OF_OFFERS = 8;
var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var PIN_MAIN_WIDTH = 65;
var PIN_MAIN_HEIGHT = 87;
var widthMap = document.querySelector('.map').offsetWidth;
var MAP_MIN_HEIHT = 130;
var MAP_MAX_HEIGHT = 630;
var pageIsActive = false;


var adForm = document.querySelector('.ad-form');
var adFormInputsSelects = adForm.querySelectorAll('input, select');
var inputAddress = adForm.querySelector('#address');

var map = document.querySelector('.map');
var mapFilters = map.querySelector('.map__filters');
var mapFiltersInputsSelects = mapFilters.querySelectorAll('input, select');
var mapPinMain = map.querySelector('.map__pin--main');

var mapPins = document.querySelector('.map__pins'); // блок, в который вставляем созданные метки
var pin = document.querySelector('#pin').content.querySelector('.map__pin'); // Шаблон, по которому создаем метки
var offers = [];

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

// Генератор случайных целых чисел в заданом диапазоне
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

// Создаем массив предложений
var createRandomOffers = function () {
  for (var i = 0; i < NUMBER_OF_OFFERS; i++) {
    var avatar = 'img/avatars/user0' + (i + 1) + '.png';
    var type = OFFER_TYPE[getRandomNumber(0, OFFER_TYPE.length - 1)];
    var locationX = getRandomNumber(PIN_WIDTH / 2, widthMap - PIN_WIDTH / 2) + 'px';
    var locationY = getRandomNumber(MAP_MIN_HEIHT, MAP_MAX_HEIGHT - PIN_HEIGHT) + 'px';
    var location = [locationX, locationY];

    var offer = { // Можно короче в 4 строки сразу author: 'img/avatars/user0' + (i + 1) + '.png'; но смущает ТЗ
      author: avatar,
      offer: type,
      location: location
    };
    offers.push(offer);
  }
  return offers;
};

// Добавляем массив предложений в документ
var renderOffers = function () {
  var fragment = document.createDocumentFragment();
  createRandomOffers();

  for (var i = 0; i < offers.length; i++) {
    var offerElement = pin.cloneNode(true);
    var pinView = offerElement.querySelector('.map__pin img');

    offerElement.style.left = offers[i].location[0];
    offerElement.style.top = offers[i].location[1];
    pinView.src = offers[i].author;
    pinView.alt = 'Заголовок объявления';

    fragment.appendChild(offerElement);
  }
  mapPins.appendChild(fragment);
};

// Функция активации страницы
var getActivePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  unsetDisabled(adFormInputsSelects);
  unsetDisabled(mapFiltersInputsSelects);
  renderOffers();
  mapPinMain.removeEventListener('click', getActivePage);
};

mapPinMain.addEventListener('click', getActivePage);


// Валидация формы

var inputPrice = adForm.querySelector('#price');
var inputType = adForm.querySelector('#type');
var inputTimeIn = adForm.querySelector('#timein');
var inputTimeOut = adForm.querySelector('#timeout');
var TypePrice = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
};

// Валидация данных формы заголовка сразу в HTML minlength="30" maxlength="100" required

// Валидация данных формы типа жилья. Смнхронизация тип-цена через объект TypePrice
var onFieldTypeChange = function (type) {
  inputPrice.min = TypePrice[type];
  inputPrice.placeholder = TypePrice[type];
};

inputType.addEventListener('change', function () {
  onFieldTypeChange(inputType.value);
});

// Запрещаем ручное редактирование поля адреса в HTML. Когда к тегу <input> добавляется атрибут readonly, текстовое
// поле не может изменяться пользователем, в том числе вводиться новый текст или модифицироваться существующий. Тем не менее, состояние и содержимое поля можно менять с помощью скриптов.

// Связываем время заезда и выезда
inputTimeIn.addEventListener('input', function () {
  inputTimeOut.value = inputTimeIn.value;
});

inputTimeOut.addEventListener('input', function () {
  inputTimeIn.value = inputTimeOut.value;
});


// Перемещение mapPinMain на карте

// функция для записи координат указателя пина mapPinMain в поле с адресом
// Функция получения координат острого конца Главного Пина
(function () {
  var startCoords = { // Начальные координаты точки курсора, с которой мы начали перемещать пин
    x: 0,
    y: 0
  };
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

    if (curY <= MAP_MIN_HEIHT) {
      mapPinMain.style.top = MAP_MIN_HEIHT - PIN_MAIN_HEIGHT + 'px';
    }

    if (curY >= MAP_MAX_HEIGHT) {
      mapPinMain.style.top = MAP_MAX_HEIGHT - PIN_MAIN_HEIGHT + 'px';
    }

    getPinMainCoordinates();
  };

  // Функция сброса обработчика события движения и отпускания мыши
  var onMouseUp = function (evtMouseUp) {
    evtMouseUp.preventDefault();

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    if (pageIsActive) {
      var onClickPreventDefault = function (moveEvt) {
        moveEvt.preventDefault();
        mapPinMain.removeEventListener('click', onClickPreventDefault);
      };
      mapPinMain.addEventListener('click', onClickPreventDefault);
    }
  };

  mapPinMain.addEventListener('mousedown', function (evtMouseDown) { // обработаем событие начала перетаскивания нашегодиалога mousedown.
    evtMouseDown.preventDefault();
    pageIsActive = true; // выбор аватара — это нажатие без перемещения, а если мы нажали и начали двигать курсор,то действие выбора файла надо отменить
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
