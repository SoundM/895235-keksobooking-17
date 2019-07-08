'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var mapPins = document.querySelector('.map__pins'); // блок, в который вставляем созданные метки
  var pin = document.querySelector('#pin').content.querySelector('.map__pin'); // Шаблон, по которому создаем метки

  var createOffer = function (pinElement) {
    var offerElement = pin.cloneNode(true);
    var pinCoordX = 'left: ' + (pinElement.location.x - PIN_WIDTH / 2) + 'px';
    var pinCoordY = 'top: ' + (pinElement.location.y - PIN_HEIGHT) + 'px';
    offerElement.setAttribute('style', pinCoordX + '; ' + pinCoordY);
    offerElement.querySelector('img').setAttribute('src', pinElement.author.avatar);
    offerElement.querySelector('img').setAttribute('alt', pinElement.offer.title);
    return offerElement;
  };

  // Добавляем массив предложений в документ
  var renderOffers = function (pins) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pins.length; i++) {
      fragment.appendChild(createOffer(pins[i]));
    }
    mapPins.appendChild(fragment);
  };

  var removeOffers = function () {
    var renderedPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var similarPins = Array.from(renderedPins);
    similarPins.forEach(function (value) {
      mapPins.removeChild(value);
    });
  };

  window.offers = {
    renderOffers: renderOffers,
    removeOffers: removeOffers
  };

})();
