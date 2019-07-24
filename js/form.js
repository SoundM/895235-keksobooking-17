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


  // Функция расстановки disabled для input и select в форме
  var setDisabled = function (arr) {
    for (var i = 0; i < arr.length; i++) {
      arr[i].setAttribute('disabled', 'disabled');
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
  roomNumber.addEventListener('click', function (evt) {
    var roomsValue = evt.target.options[evt.target.selectedIndex].value;

    [].forEach.call(optionsGuests, function (option) {
      if (roomsForGuests[roomsValue].includes(option.value)) {
        option.disabled = false;
      } else {
        option.disabled = true;
      }
    });
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

})();

/**
 var onFieldRoomsChange = function (value) {
    optionsGuests.forEach(function (option) {
      option.disabled = GuestsInRooms[value].indexOf(option.value) === -1;
    });
  };

  var onFieldGuestsValidity = function (value) {
    if (GuestsInRooms[value].indexOf(capacityRooms.value) === -1) {
      capacityRooms.setCustomValidity('Укажите другое количество гостей');
    }
  };

  capacityRooms.addEventListener('change', function () {
    if (GuestsInRooms[roomNumber.value].indexOf(event.target.value) !== -1) {
      capacityRooms.setCustomValidity('');
    }
  });

  roomNumber.addEventListener('change', function () {
    onFieldRoomsChange(event.target.value);
    onFieldGuestsValidity(event.target.value);
  });
 */
