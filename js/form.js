'use strict';

(function () {
  // Валидация формы
  var ESC_KEYCODE = 27;
  var TypePrice = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };
  var roomsForGuests = {
    1: ['1'],
    2: ['1', '2'],
    3: ['1', '2', '3'],
    100: ['0']
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
  var mainElement = document.querySelector('main');
  var errorBlock = document.querySelector('#error').content.querySelector('.error');


  // Функция расстановки disabled для input и select в форме
  var setDisabled = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].setAttribute('disabled', 'disabled');
    }
    for (var j = 0; j < optionsGuests.length; j++) {
      optionsGuests[j].setAttribute('disabled', 'disabled');
      if (optionsGuests[j].hasAttribute('selected')) {
        optionsGuests[j].removeAttribute('disabled');
      }
    }
  };

  // Функция снятия disabled
  window.unsetDisabled = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].removeAttribute('disabled');
    }
  };

  setDisabled(adFormInputsSelects);
  setDisabled(mapFiltersInputsSelects);

  // Валидация данных формы заголовка сразу в HTML minlength="30" maxlength="100" required

  // Валидация данных формы типа жилья. Смнхронизация тип-цена через объект TypePrice
  var onFieldTypeChange = function (type) {
    inputPrice.min = TypePrice[type];
    inputPrice.placeholder = inputPrice.min;
    inputPrice.value = inputPrice.min;
  };

  inputType.addEventListener('click', function () {
    onFieldTypeChange(inputType.value);
  });

  // Валидация данных формы число комнат для количества гостей.
  roomNumber.addEventListener('change', function (evt) {
    var roomsValue = evt.target.options[evt.target.selectedIndex].value;
    houseCapacity.setCustomValidity('Выберете количество гостей в соответствии с числом комнат');

    optionsGuests.forEach(function (option) {
      option.disabled = !roomsForGuests[roomsValue].includes(option.value);
    });
  });

  houseCapacity.addEventListener('click', function (evt) {
    if (evt.target.options[evt.target.selectedIndex].hasAttribute('disabled') !== true) {
      houseCapacity.setCustomValidity('');
    }
  });

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
  var isEscEvent = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };

  var onErrorEscPress = function (evt) {
    isEscEvent(evt, closePopupError);
  };


  var onSuccessEscPress = function (evt) {
    isEscEvent(evt, closePopupSuccess);
  };

  var closePopupError = function () {
    var errorCard = document.querySelector('.error');
    errorCard.classList.add('hidden');
    document.removeEventListener('keydown', onErrorEscPress);
  };

  var closePopupSuccess = function () {
    var successCard = document.querySelector('.success');
    successCard.classList.add('hidden');
    document.removeEventListener('keydown', onSuccessEscPress);
  };

  var setDefaultPosition = function () {
    window.main.mapPinMain.style.left = '570px';
    window.main.mapPinMain.style.top = '375px';
    inputPrice.placeholder = '5000';
  };

  var showSuccessMessage = function () {
    var successMessage = successBlock.cloneNode(true);
    mainElement.appendChild(successMessage);
    mainElement.addEventListener('click', closePopupSuccess);
    document.addEventListener('keydown', onSuccessEscPress);
  };

  var successHandler = function () {
    showSuccessMessage();
    window.main.adForm.reset();
    window.offers.removeOffers();
    setDisabled(adFormInputsSelects);
    setDefaultPosition();
  };

  var errorHandler = function (errorMessage) {
    var errorModule = errorBlock.cloneNode(true);
    mainElement.appendChild(errorModule);
    errorBlock.textContent = errorMessage;
    mainElement.addEventListener('click', closePopupError);
    document.addEventListener('keydown', onErrorEscPress);
  };


  window.main.adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(window.main.adForm), successHandler, errorHandler);
  });

})();
