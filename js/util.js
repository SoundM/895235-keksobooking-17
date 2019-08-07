'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var KeyCode = {
    ESC: 27,
    ENTER: 13,
    SPACE: 32
  };

  var isEscEvent = function (evt, action) {
    if (evt.keyCode === KeyCode.ESC) {
      action();
    }
  };

  var isEnterEvent = function (evt, action) {
    if (evt.keyCode === KeyCode.ENTER) {
      action();
    }
  };

  var isSpaceEvent = function (evt, action) {
    if (evt.keyCode === KeyCode.SPACE) {
      action();
    }
  };

  var debounce = function (cb) {
    var lastTimeout = null;
    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        clearTimeout(lastTimeout);
      }
      lastTimeout = setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.util = {
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent,
    isSpaceEvent: isSpaceEvent,
    debounce: debounce
  };

})();
