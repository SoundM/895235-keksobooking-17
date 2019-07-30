'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var mapPins = document.querySelector('.map__pins'); // блок, в который вставляем созданные метки
  var pin = document.querySelector('#pin').content.querySelector('.map__pin'); // Шаблон, по которому создаем метки

  var create = function (pinElement) {
    var offerElement = pin.cloneNode(true);
    var pinCoordX = 'left: ' + (pinElement.location.x - PIN_WIDTH / 2) + 'px';
    var pinCoordY = 'top: ' + (pinElement.location.y - PIN_HEIGHT) + 'px';
    offerElement.setAttribute('style', pinCoordX + '; ' + pinCoordY);
    offerElement.querySelector('img').setAttribute('src', pinElement.author.avatar);
    offerElement.querySelector('img').setAttribute('alt', pinElement.offer.title);
    offerElement.addEventListener('click', function () {
      window.card.set(pinElement);
      offerElement.classList.add('map__pin--active');
    });
    return offerElement;
  };

  // Добавляем массив предложений в документ
  var render = window.util.debounce(function (pins) {
    remove();
    var fragment = document.createDocumentFragment();
    pins.forEach(function (it) {
      fragment.appendChild(create(it));
    });
    mapPins.appendChild(fragment);
  });

  var remove = function () {
    var renderedPins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    renderedPins.forEach(function (value) {
      value.remove();
    });
  };

  var removeActivePin = function () {
    var mapPin = document.querySelectorAll('.map__pin');
    mapPin.forEach(function (element) {
      element.classList.remove('map__pin--active');
    });
  };


  window.offers = {
    render: render,
    remove: remove,
    removeActivesPin: removeActivePin
  };

})();
