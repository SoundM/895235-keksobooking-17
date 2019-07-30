'use strict';

(function () {
  var Url = {
    URL_LOAD: 'https://js.dump.academy/keksobooking/data',
    URL_SAVE: 'https://js.dump.academy/keksobooking',
  };


  var load = function (onLoad, onError) {
    window.request.create(onLoad, onError, 'GET', Url.URL_LOAD);
  };

  var save = function (data, onLoad, onError) {
    window.request.create(onLoad, onError, 'POST', Url.URL_SAVE, data);
  };

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 400px auto; width: 500px; text-align: center; background-color: blue;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend = {
    load: load,
    save: save,
    errorHandler: errorHandler
  };
})();
