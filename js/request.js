'use strict';

(function () {
  var createRequest = function (onLoad, onError, type, URL, data) {
    var XHR = new XMLHttpRequest();
    XHR.timeout = 10000;
    XHR.responseType = 'json';
    XHR.open(type, URL);
    XHR.send(data);

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

    return XHR;
  };

  window.request = {
    createRequest: createRequest
  };
})();
