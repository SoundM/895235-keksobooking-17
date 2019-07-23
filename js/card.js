'use strict';

(function () {
  var map = document.querySelector('.map');
  var card = document.querySelector('#card').content.querySelector('.map__card');
  var cardPopup = card.cloneNode(true);
  var filtersContainer = map.querySelector('.map__filters-container');
  var HousingType = {
    bungalo: 'Бунгало',
    flat: 'Квартира',
    house: 'Дом',
    palace: 'Дворец'
  };
  var ESC_KEYCODE = 27;

  var isEscEvent = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };

  var onPopupEscPress = function (evt) {
    isEscEvent(evt, closePopup);
  };

  var closePopup = function () {
    var popup = document.querySelector('.popup');
    popup.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
  };

  var openPopup = function () {
    var popup = document.querySelector('.popup');
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

  var renderCard = function (cardElement) {
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
    cardPopup.classList.add('hidden');
    return cardPopup;
  };

  var cardControl = function (cardElement) {
    renderCard(cardElement);
    map.insertBefore(cardPopup, filtersContainer);

    var popupClose = map.querySelector('.popup__close');
    popupClose.addEventListener('click', function () {
      closePopup();
    });
    document.addEventListener('keydown', onPopupEscPress);
  };


  var setCard = function (pins) {
    var selectPins = map.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < selectPins.length; i++) {
      selectPins[i].addEventListener('click', function () {
        cardControl(pins[0]);
        openPopup();
      });
    }
  };

  window.card = {
    setCard: setCard
  };

})();
