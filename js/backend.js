'use strict';

(function () {
  var load = function (onLoad, onError) {
    var URL_LOAD = 'https://js.dump.academy/keksobooking/data';
    window.request.createRequest(onLoad, onError, 'GET', URL_LOAD);
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
    errorHandler: errorHandler
  };
})();
