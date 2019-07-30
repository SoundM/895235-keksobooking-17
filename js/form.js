'use strict';

(function () {
  // Валидация формы

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
    inputPrice.min = '1000';
  };

  setDisabled(adFormInputsSelects);
  setDisabled(mapFiltersInputsSelects);

  // Валидация данных формы заголовка сразу в HTML minlength="30" maxlength="100" required

  // Валидация данных формы типа жилья. Смнхронизация тип-цена через объект TypePrice
  var onFieldTypeChange = function (type) {
    inputPrice.min = TypePrice[type];
    inputPrice.placeholder = inputPrice.min;
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
    if (!evt.target.options[evt.target.selectedIndex].hasAttribute('disabled')) {
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
  var onErrorEscPress = function (evt) {
    window.util.isEscEvent(evt, closeError);
  };


  var onSuccessEscPress = function (evt) {
    window.util.isEscEvent(evt, closeSuccess);
  };

  var closeError = function () {
    var errorCard = mainElement.querySelector('.error');
    errorCard.remove();
    mainElement.removeEventListener('click', closeError);
    document.removeEventListener('keydown', onErrorEscPress);
  };

  var closeSuccess = function () {
    var successCard = mainElement.querySelector('.success');
    successCard.remove();
    document.removeEventListener('keydown', onSuccessEscPress);
    mainElement.removeEventListener('click', closeSuccess);
  };

  var setDefaultPositionReset = function () {
    window.main.adForm.classList.add('ad-form--disabled');
    window.main.map.classList.add('map--faded');
    window.main.map.querySelector('.map__title').classList.add('hidden');
    window.filter.reset();
    window.main.adForm.reset();
    window.main.mapPinMain.style.left = '570px';
    window.main.mapPinMain.style.top = '375px';
    inputPrice.placeholder = '5000';
    inputPrice.min = '1000';
    setDisabled(adFormInputsSelects);
    setDisabled(mapFiltersInputsSelects);
    window.card.remove();
    window.offers.remove();
    window.avatarAndPhoto.removeAvatar();
    window.avatarAndPhoto.removeImg();
  };

  var showSuccessMessage = function () {
    var successMessage = successBlock.cloneNode(true);
    mainElement.appendChild(successMessage);
    mainElement.addEventListener('click', closeSuccess);
    document.addEventListener('keydown', onSuccessEscPress);
  };

  var successHandler = function () {
    showSuccessMessage();
    setDefaultPositionReset();
  };

  var errorHandler = function (errorMessage) {
    var errorModule = errorBlock.cloneNode(true);
    mainElement.appendChild(errorModule);
    errorBlock.textContent = errorMessage;
    mainElement.addEventListener('click', closeError);
    document.addEventListener('keydown', onErrorEscPress);
  };

  adFormReset.addEventListener('click', function (evt) {
    evt.preventDefault();
    setDefaultPositionReset();
  });


  window.main.adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(window.main.adForm), successHandler, errorHandler);
  });

  window.form = {
    unsetDisabled: unsetDisabled
  };

})();
