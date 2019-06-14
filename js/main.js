'use strict';

var NUMBER_OF_OFFERS = 18;
var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var widthMap = document.querySelector('.map').offsetWidth;

// переключаем карту из неактивного состояния в активное
var map = document.querySelector('.map');
map.classList.remove('map--faded');

var pinOffers = document.querySelector('.map__pins'); // блок, в который вставляем созданные метки
var pin = document.querySelector('#pin').content.querySelector('.map__pin'); // Шаблон, по которому создаем метки
var offers = [];

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
    var locationY = getRandomNumber(130 + PIN_HEIGHT, 630) + 'px';
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
    offerElement.style.left = offers[i].location[0];
    offerElement.style.top = offers[i].location[1];
    // !Тут лучше через querySelector, защитит от последствий возможных изменений DOMa в будущем
    offerElement.querySelector('.map__pin img').src = offers[i].author;
    offerElement.querySelector('.map__pin img').alt = 'Заголовок объявления';

    fragment.appendChild(offerElement);
  }
  pinOffers.appendChild(fragment);
};

renderOffers();
