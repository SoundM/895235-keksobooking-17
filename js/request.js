'use strict';

(function () {
  var OK_STATUS = 200;
  var create = function (onLoad, onError, method, url, data) {
    var XHR = new XMLHttpRequest();
    XHR.timeout = 10000;
    XHR.responseType = 'json';

    XHR.addEventListener('load', function () {
      if (XHR.status === OK_STATUS) {
        onLoad(XHR.response);
      } else {
        onError('Статус ответа: ' + XHR.status + ' ' + XHR.statusText);
      }
    });
    XHR.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    XHR.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + XHR.timeout + 'мс');
    });

    XHR.open(method, url);
    XHR.send(data);
  };

  window.request = {
    create: create
  };
})();
