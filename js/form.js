'use strict';

(function () {
  // Валидация формы

  var inputPrice = window.main.adForm.querySelector('#price');
  var inputType = window.main.adForm.querySelector('#type');
  var inputTimeIn = window.main.adForm.querySelector('#timein');
  var inputTimeOut = window.main.adForm.querySelector('#timeout');
  var TypePrice = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  // Валидация данных формы заголовка сразу в HTML minlength="30" maxlength="100" required

  // Валидация данных формы типа жилья. Смнхронизация тип-цена через объект TypePrice
  var onFieldTypeChange = function (type) {
    inputPrice.min = TypePrice[type];
    inputPrice.placeholder = TypePrice[type];
  };

  inputType.addEventListener('change', function () {
    onFieldTypeChange(inputType.value);
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
