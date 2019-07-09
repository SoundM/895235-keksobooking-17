'use strict';

(function () {
  var MAX_PINS = 5;
  var housingTypeFilter = document.querySelector('#housing-type');
  var currentHousingTypeFilter = housingTypeFilter.value;
  var offersPins = [];

  housingTypeFilter.addEventListener('change', function () {
    currentHousingTypeFilterChange();
  });


  var currentHousingTypeFilterChange = function () {
    currentHousingTypeFilter = housingTypeFilter.value;
    filterOffers();
  };

  var filterOffers = function () {
    window.offers.removeOffers();
    var sameOffersPins = offersPins.filter(function (it) {

      if (currentHousingTypeFilter !== 'any') {
        return it.offer.type === currentHousingTypeFilter;
      }
      return true;
    });

    window.offers.renderOffers(sameOffersPins.slice(0, MAX_PINS));
  };

  var successHandler = function (data) {
    offersPins = data;
    filterOffers();
  };

  window.filter = {
    successHandler: successHandler
  };
})();
