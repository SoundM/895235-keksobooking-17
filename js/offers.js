'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var DEBOUNCE_INTERVAL = 500;
  var mapPins = document.querySelector('.map__pins'); // блок, в который вставляем созданные метки
  var pin = document.querySelector('#pin').content.querySelector('.map__pin'); // Шаблон, по которому создаем метки

  var createOffer = function (pinElement) {
    var offerElement = pin.cloneNode(true);
    var pinCoordX = 'left: ' + (pinElement.location.x - PIN_WIDTH / 2) + 'px';
    var pinCoordY = 'top: ' + (pinElement.location.y - PIN_HEIGHT) + 'px';
    offerElement.setAttribute('style', pinCoordX + '; ' + pinCoordY);
    offerElement.querySelector('img').setAttribute('src', pinElement.author.avatar);
    offerElement.querySelector('img').setAttribute('alt', pinElement.offer.title);
    offerElement.addEventListener('click', function () {
      window.card.setCard(pinElement);
    });
    return offerElement;
  };

  // Добавляем массив предложений в документ
  var renderOffers = function (pins) {
    removeOffers();
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pins.length; i++) {
      fragment.appendChild(createOffer(pins[i]));
    }
    mapPins.appendChild(fragment);
  };

  var removeOffers = function () {
    var renderedPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    renderedPins.forEach(function (value) {
      value.remove();
    });
  };

  var debounce = function (cb) {
    var lastTimeout = null;
    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.offers = {
    renderOffers: debounce(renderOffers),
    removeOffers: removeOffers
  };

})();
