'use strict';

(function () {
  var KeyCode = {
    ESC: 27,
  };
  var HousingType = {
    bungalo: 'Бунгало',
    flat: 'Квартира',
    house: 'Дом',
    palace: 'Дворец'
  };
  var map = document.querySelector('.map');
  var card = document.querySelector('#card').content.querySelector('.map__card');
  var cardPopup = card.cloneNode(true);
  var filtersContainer = map.querySelector('.map__filters-container');

  var getEscEvent = function (evt, action) {
    if (evt.keyCode === KeyCode.ESC) {
      action();
    }
  };

  var onEscPress = function (evt) {
    getEscEvent(evt, close);
  };

  var close = function () {
    var popup = map.querySelector('.popup');
    popup.classList.add('hidden');
    window.offers.removeActivesPin();
    document.removeEventListener('keydown', onEscPress);
  };

  var open = function () {
    var popup = map.querySelector('.popup');
    popup.classList.remove('hidden');
  };

  var createLiElement = function (el, secondClass) {
    var li = document.createElement('li');
    li.classList.add('popup__feature');
    li.classList.add('popup__feature--' + secondClass + '');
    el.insertAdjacentElement('afterbegin', li);
  };

  var createImgElement = function (el, imgSrc) {
    var img = document.createElement('img');
    img.classList.add('popup__photo');
    img.width = '45';
    img.height = '40';
    img.alt = 'Фотография жилья';
    img.src = imgSrc;
    el.insertAdjacentElement('afterbegin', img);
  };

  var render = function (cardElement) {
    cardPopup.querySelector('.popup__title').innerText = cardElement.offer.title;
    cardPopup.querySelector('.popup__text--address').innerText = cardElement.offer.address;
    cardPopup.querySelector('.popup__text--price').innerText = cardElement.offer.price + '₽/ночь';
    cardPopup.querySelector('.popup__type').innerText = HousingType[cardElement.offer.type];
    cardPopup.querySelector('.popup__text--capacity').innerText = cardElement.offer.rooms + ' комнаты для ' + cardElement.offer.guests + ' гостей.';
    cardPopup.querySelector('.popup__text--time').innerText = 'Заезд после ' + cardElement.offer.checkin + ' выезд до ' + cardElement.offer.checkout;
    var cardFeature = cardPopup.querySelector('.popup__features');
    cardPopup.querySelector('.popup__description').innerText = cardElement.offer.description;
    var cardPhotos = cardPopup.querySelector('.popup__photos');
    cardPopup.querySelector('.popup__avatar').src = cardElement.author.avatar;
    cardFeature.innerHTML = '';
    for (var j = 0; j < cardElement.offer.features.length; j++) {
      createLiElement(cardFeature, cardElement.offer.features[j]);
    }
    cardPhotos.innerHTML = '';
    for (var i = 0; i < cardElement.offer.photos.length; i++) {
      createImgElement(cardPhotos, cardElement.offer.photos[i]);
    }
    map.insertBefore(cardPopup, filtersContainer);

    return cardPopup;
  };

  var setControl = function (cardElement) {
    render(cardElement);

    var popupClose = map.querySelector('.popup__close');
    popupClose.addEventListener('click', function () {
      close();
    });
    document.addEventListener('keydown', onEscPress);
  };

  var set = function (pinElement) {
    window.offers.removeActivesPin();
    setControl(pinElement);
    open();
  };

  var remove = function () {
    cardPopup.classList.add('hidden');
  };

  window.card = {
    set: set,
    remove: remove
  };

})();
