'use strict';

var NUMBER_OF_OFFERS = 8;
var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var PIN_MAIN_WIDTH = 65;
var PIN_MAIN_HEIGHT = 87;
var widthMap = document.querySelector('.map').offsetWidth;


var adForm = document.querySelector('.ad-form');
var adFormInputsSelects = adForm.querySelectorAll('input, select');
var adFormAddressInput = adForm.querySelector('#address');

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
    var locationY = getRandomNumber(130, 630 - PIN_HEIGHT) + 'px';
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

var counter = 0;
mapPinMain.addEventListener('click', function () {
  if (counter === 1) {
    renderOffers();
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    unsetDisabled(adFormInputsSelects);
    unsetDisabled(mapFiltersInputsSelects);
  }
  counter++;
});

adFormAddressInput.value = '570, 375';

// Функция получения координат острого конца Главного Пина
var getPinMainCoordinates = function (elementWidth, elementHeight) { // https://developer.mozilla.org/ru/docs/Web/API/Element/getBoundingClientRect
  var mapCoordinates = map.getBoundingClientRect();
  var pinMainCoordinates = mapPinMain.getBoundingClientRect();
  var pinMainLeft = pinMainCoordinates.left - mapCoordinates.left + elementWidth / 2;
  var pinMainTop = pinMainCoordinates.top - mapCoordinates.top + elementHeight;
  adFormAddressInput.value = pinMainLeft + ',' + pinMainTop;
};

mapPinMain.addEventListener('mouseup', function () {
  getPinMainCoordinates(PIN_MAIN_WIDTH, PIN_MAIN_HEIGHT);
});

// Часть вторая

var inputTitle = adForm.querySelector('#title');
var inputPrice = adForm.querySelector('#price');
var inputType = adForm.querySelector('#type');
var inputTimeIn = adForm.querySelector('#timein');
var inputTimeOut = adForm.querySelector('#timeout');


// Валидация данных формы заголовка
inputTitle.addEventListener('input', function (evt) {
  var target = evt.target;
  inputTitle.required = true;

  if (target.value.length < 30) {
    target.setCustomValidity('Заголовок объявления не должен быть короче 30 символов');
  } else if (target.value.length > 100) {
    target.setCustomValidity('Заголовок объявления не должен быть длиннее 100 символов');
  } else {
    target.setCustomValidity('');
  }
});

// Валидация данных формы типа жилья
inputPrice.addEventListener('input', function (evt) {
  var target = evt.target;
  target.required = true;
  target.type = 'number';

  if (inputType.value === 'bungalo' && target.value < 0) {
    target.setCustomValidity('Цена за ночь не может быть ниже 0');
  } else if (inputType.value === 'flat' && target.value < 1000) {
    target.setCustomValidity('Цена за ночь не может быть ниже 1 000');
  } else if (inputType.value === 'house' && target.value < 5000) {
    target.setCustomValidity('Цена за ночь не может быть ниже 5 000');
  } else if (inputType.value === 'palace' && target.value < 10000) {
    target.setCustomValidity('Цена за ночь не может быть ниже 10 000');
  } else if (target.value > 1000000) {
    target.setCustomValidity('Цена за ночь не может быть более 1 000 000');
  } else {
    target.setCustomValidity('');
  }
});

// Устанавливаем связь между типом жилья и ценой за ночь
inputType.addEventListener('input', function (evt) {
  var target = evt.target;

  if (target.value === 'bungalo') {
    inputPrice.setAttribute('min', 0);
    inputPrice.placeholder = '0';
  } else if (target.value === 'flat') {
    inputPrice.setAttribute('min', 1000);
    inputPrice.placeholder = '1 000';
  } else if (target.value === 'house') {
    inputPrice.setAttribute('min', 5000);
    inputPrice.placeholder = '5 000';
  } else {
    inputPrice.setAttribute('min', 10000);
    inputPrice.placeholder = '10 000';
  }
});

// Запрещаем ручное редактирование поля адреса
setDisabled(adFormAddressInput);

// Связываем время заезда и выезда
inputTimeIn.addEventListener('input', function () {
  inputTimeOut.value = inputTimeIn.value;
});

inputTimeOut.addEventListener('input', function () {
  inputTimeIn.value = inputTimeOut.value;
});

