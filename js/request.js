'use strict';

(function () {
  var createRequest = function (onLoad, onError, method, url, data) {
    var XHR = new XMLHttpRequest();
    XHR.timeout = 10000;
    XHR.responseType = 'json';

    XHR.addEventListener('load', function () {
      if (XHR.status === 200) {
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
    createRequest: createRequest
  };
})();
