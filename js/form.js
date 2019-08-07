'use strict';

(function () {
  // Валидация формы
  var InputPriceDefault = {
    PLACEHOLDER: '1000',
    MIN: '1000'
  };
  var TypePrice = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };
  var RoomsForGuests = {
    1: ['1'],
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: ['0']
  };
  var MainPinCoordinates = {
    LEFT: '570px',
    TOP: '375px'
  };

  var adFormInputsSelects = window.main.adFormInputsSelects;
  var mapFiltersInputsSelects = window.main.mapFiltersInputsSelects;
  var inputPrice = window.main.adForm.querySelector('#price');
  var inputType = window.main.adForm.querySelector('#type');
  var inputTimeIn = window.main.adForm.querySelector('#timein');
  var inputTimeOut = window.main.adForm.querySelector('#timeout');
  var roomNumber = window.main.adForm.querySelector('#room_number');
  var houseCapacity = window.main.adForm.querySelector('#capacity');
  var optionsGuests = houseCapacity.querySelectorAll('option');
  var successBlock = document.querySelector('#success').content.querySelector('.success');
  var mainBlock = document.querySelector('main');
  var errorBlock = document.querySelector('#error').content.querySelector('.error');
  var adFormReset = window.main.adForm.querySelector('.ad-form__reset');


  // Функция расстановки disabled для input и select в форме
  var setDisabled = function (arr) {
    arr.forEach(function (it) {
      it.setAttribute('disabled', 'disabled');
    });
    optionsGuests.forEach(function (it) {
      it.setAttribute('disabled', 'disabled');
      if (it.hasAttribute('selected')) {
        it.removeAttribute('disabled');
      }
    });
  };

  // Функция снятия disabled
  var unsetDisabled = function (arr) {
    arr.forEach(function (it) {
      it.removeAttribute('disabled');
    });
  };

  setDisabled(adFormInputsSelects);
  setDisabled(mapFiltersInputsSelects);

  // Валидация данных формы заголовка сразу в HTML minlength="30" maxlength="100" required

  // Валидация данных формы типа жилья. Смнхронизация тип-цена через объект TypePrice
  var onFieldTypeChange = function (type) {
    inputPrice.min = TypePrice[type];
    inputPrice.placeholder = inputPrice.min;
  };

  inputType.addEventListener('change', function () {
    onFieldTypeChange(inputType.value);
  });

  // Валидация данных формы число комнат для количества гостей.
  roomNumber.addEventListener('change', function (evt) {
    var roomsValue = evt.target.options[evt.target.selectedIndex].value;
    houseCapacity.setCustomValidity('Выберете количество гостей в соответствии с числом комнат');

    optionsGuests.forEach(function (option) {
      option.disabled = !RoomsForGuests[roomsValue].includes(option.value);
    });
    checkCompliance();
  });

  houseCapacity.addEventListener('change', function () {
    houseCapacity.setCustomValidity('');
  });

  var checkCompliance = function () {
    var currentIndexOptionsGuests = window.main.adForm.querySelector('#capacity').selectedIndex;
    if (!optionsGuests[currentIndexOptionsGuests].hasAttribute('disabled')) {
      houseCapacity.setCustomValidity('');
    }
  };

  // Запрещаем ручное редактирование поля адреса в HTML. Когда к тегу <input> добавляется атрибут readonly, текстовое
  // поле не может изменяться пользователем, в том числе вводиться новый текст или модифицироваться существующий. Тем не менее, состояние и содержимое поля можно менять с помощью скриптов.

  // Связываем время заезда и выезда
  inputTimeIn.addEventListener('input', function () {
    inputTimeOut.value = inputTimeIn.value;
  });

  inputTimeOut.addEventListener('input', function () {
    inputTimeIn.value = inputTimeOut.value;
  });

  // Отправляем форму
  // Сообщение об успешной отправке формы
  var onErrorEscPress = function (evt) {
    window.util.isEscEvent(evt, onErrorClose);
  };


  var onSuccessEscPress = function (evt) {
    window.util.isEscEvent(evt, onSuccessClose);
  };

  var onErrorClose = function () {
    var errorCard = mainBlock.querySelector('.error');
    errorCard.remove();
    mainBlock.removeEventListener('click', onErrorClose);
    document.removeEventListener('keydown', onErrorEscPress);
  };

  var onSuccessClose = function () {
    var successCard = mainBlock.querySelector('.success');
    successCard.remove();
    document.removeEventListener('keydown', onSuccessEscPress);
    mainBlock.removeEventListener('click', onSuccessClose);
  };

  var setDefaultPositionReset = function () {
    window.main.adForm.classList.add('ad-form--disabled');
    window.main.map.classList.add('map--faded');
    window.main.map.querySelector('.map__title').classList.add('hidden');
    window.filter.reset();
    window.main.adForm.reset();
    window.main.mapPin.style.left = MainPinCoordinates.LEFT;
    window.main.mapPin.style.top = MainPinCoordinates.TOP;
    inputPrice.placeholder = InputPriceDefault.PLACEHOLDER;
    inputPrice.min = InputPriceDefault.MIN;
    setDisabled(adFormInputsSelects);
    setDisabled(mapFiltersInputsSelects);
    window.main.mapPinButton.addEventListener('keydown', window.main.onMapPinButtonEnterPress);
    window.card.remove();
    window.offers.remove();
    window.photo.removeAvatar();
    window.photo.removeImg();
  };

  var onSuccessShowMessage = function () {
    var successMessage = successBlock.cloneNode(true);
    mainBlock.appendChild(successMessage);
    mainBlock.addEventListener('click', onSuccessClose);
    document.addEventListener('keydown', onSuccessEscPress);
  };

  var onSuccess = function () {
    onSuccessShowMessage();
    setDefaultPositionReset();
  };

  var onErrorShowMessage = function () {
    var errorMessage = errorBlock.cloneNode(true);
    mainBlock.appendChild(errorMessage);
    mainBlock.addEventListener('click', onErrorClose);
    document.addEventListener('keydown', onErrorEscPress);
  };

  adFormReset.addEventListener('click', function (evt) {
    evt.preventDefault();
    setDefaultPositionReset();
  });


  window.main.adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(window.main.adForm), onSuccess, onErrorShowMessage);
  });

  window.form = {
    unsetDisabled: unsetDisabled
  };

})();
