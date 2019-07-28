'use strict';
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var avatar = window.main.adForm.querySelector('#avatar');
  var adFormHeaderPreviewImg = window.main.adForm.querySelector('.ad-form-header__preview img');
  var images = window.main.adForm.querySelector('#images');
  var adFormPhotoContainer = window.main.adForm.querySelector('.ad-form__photo-container');
  var adFormUpload = window.main.adForm.querySelector('.ad-form__upload');


  var checkPicture = function (file) {
    var fileName = file.name.toLowerCase();
    return FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });
  };

  avatar.addEventListener('change', function () {
    var file = avatar.files[0];
    var checkResult = checkPicture(file);
    if (checkResult) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        adFormHeaderPreviewImg.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  });

  images.addEventListener('change', function () {
    var adFormPhoto = window.main.adForm.querySelector('.ad-form__photo');
    var file = images.files[0];
    var checkResult = checkPicture(file);
    if (checkResult) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        var createPhoto = adFormPhoto.cloneNode();
        var newPhoto = document.createElement('img');
        newPhoto.src = reader.result;
        newPhoto.width = 70;
        newPhoto.height = 70;
        newPhoto.alt = 'Фото жилья';
        createPhoto.setAttribute('data-img', 'added');
        createPhoto.appendChild(newPhoto);
        if (adFormPhotoContainer.children.length < 5) {
          adFormPhotoContainer.insertBefore(createPhoto, adFormPhotoContainer.children[adFormPhotoContainer.children.length - 1]);
        } else {
          window.main.adForm.querySelector('label.ad-form__drop-zone').innerHTML = 'Места для фото больше' +
            ' нет';
        }
      });
      reader.readAsDataURL(file);
    }
  });

  var draggedPhoto = null;

  adFormPhotoContainer.addEventListener('dragstart', function (evt) { // пользователь начинает перетаскивание элемента
    if (evt.target.tagName.toLowerCase() === 'img') {
      draggedPhoto = evt.target; // Ссылка на объект, который был инициатором события
      evt.dataTransfer.setData('text/plain', evt.target.alt); // dataTransfer.setData(format, data): добавляет данные в нужном формате.
    }
  });


  adFormPhotoContainer.addEventListener('dragover', function (evt) { // Данное событие срабатывает каждые несколько сотен
    // милисекунд, когда перемещаемый элемент оказывается над зоной, принимающей перетаскиваемые элементы.
    evt.preventDefault();
    return false;
  });

  adFormPhotoContainer.addEventListener('drop', function (evt) { // вызывается для элемента, над которым произошло
    // "сбрасывание" перемещаемого элемента. Событие отвечает за извлечение "сброшенных" данных и их вставку. Событие будет срабатывать только при завершении операции перетаскивания, например, событие не сработает, если пользователь отменит перетаскивание нажатием Esc, или не донесет элемент, до цели
    if (evt.target.tagName !== 'IMG' && evt.target.tagName !== 'LABEL') {
      evt.target.style.backgroundColor = '';
      evt.target.appendChild(draggedPhoto);
    }
  });

  adFormPhotoContainer.addEventListener('dragenter', function (evt) { //  dragenter
    // Срабатывает, когда перемещаемый элемент
    // попадает на элемент-назначение. Обработчик этого события показывает, что элемент находится над объектом на
    // который он может быть перенесен. используется для того, чтобы подсветить либо промаркировать объект над которым происходит перемещения в случае, если перемещение на данный элемент разрешено.
    evt.preventDefault();
    if (!evt.target.parentNode.classList.contains('ad-form__upload') || evt.target.tagName !== 'LABEL') {
      evt.target.style.backgroundColor = 'grey';
      adFormPhotoContainer.style.backgroundColor = '#f0f0ea';
      adFormUpload.style.backgroundColor = '#f0f0ea';
    }
  });

  adFormPhotoContainer.addEventListener('dragleave', function (evt) { // dragleave Это событие запускается в момент
    // перетаскивания, когда курсор мыши выходит за пределы элемента. Обработчикам следует убрать любую подсветку или иные индикаторы, указывавшие на присутствие курсора, чтобы тем самым обозначить реакцию на прекращение перетаскивания.
    evt.target.style.backgroundColor = '';
    evt.preventDefault();
  });

  var removeAvatar = function () {
    adFormHeaderPreviewImg.src = 'img/muffin-grey.svg';
  };

  var removeImg = function () {
    var adFormPhoto = adFormPhotoContainer.querySelectorAll('.ad-form__photo');
    adFormPhoto.forEach(function (value, i) {
      if (adFormPhoto[i].hasAttribute('data-img')) {
        value.remove();
      }
    });
  };

  window.avatarAndPhoto = {
    removeAvatar: removeAvatar,
    removeImg: removeImg
  };

})();
