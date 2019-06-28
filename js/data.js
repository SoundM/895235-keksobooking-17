'use strict';

(function () {
  var NUMBER_OF_OFFERS = 8;
  var OFFER_TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var widthMap = document.querySelector('.map').offsetWidth;
  var MAP_MIN_HEIGHT = 130;
  var MAP_MAX_HEIGHT = 630;
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
      var locationY = getRandomNumber(MAP_MIN_HEIGHT, MAP_MAX_HEIGHT - PIN_HEIGHT) + 'px';
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

  window.data = {
    widthMap: widthMap,
    MAP_MIN_HEIGHT: MAP_MIN_HEIGHT,
    MAP_MAX_HEIGHT: MAP_MAX_HEIGHT,
    offers: createRandomOffers()
  };

})();
