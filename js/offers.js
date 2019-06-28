'use strict';

(function () {
  var mapPins = document.querySelector('.map__pins'); // блок, в который вставляем созданные метки
  var pin = document.querySelector('#pin').content.querySelector('.map__pin'); // Шаблон, по которому создаем метки
  var offers = window.data.offers;

  // Добавляем массив предложений в документ
  window.renderOffers = function () {
    var fragment = document.createDocumentFragment();

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

})();
