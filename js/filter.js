'use strict';

(function () {
  var MAX_PINS = 5;
  var offersPins = [];
  var mapFilters = document.querySelector('.map__filters');
  var housingType = mapFilters.querySelector('#housing-type');
  var housingPrice = mapFilters.querySelector('#housing-price');
  var housingRooms = mapFilters.querySelector('#housing-rooms');
  var housingGuests = mapFilters.querySelector('#housing-guests');
  var features = mapFilters.querySelectorAll('input[name=features]');
  var currentHousingTypeFilter = housingType.value;
  var currentHousingPriceFilter = housingPrice.value;
  var currentHousingRoomsFilter = housingRooms.value;
  var currentHousingGuestsFilter = housingGuests.value;


  mapFilters.addEventListener('change', function () {
    window.card.deleteCard();
    currentHousingTypeFilter = housingType.value;
    currentHousingPriceFilter = housingPrice.value;
    currentHousingRoomsFilter = housingRooms.value;
    currentHousingGuestsFilter = housingGuests.value;
    filterOffers();
  });

  var checkType = function (it) {
    return (currentHousingTypeFilter !== 'any') ? it.offer.type === currentHousingTypeFilter : true;
  };

  var getPriceRange = function (price) {
    if (price < 10000) {
      return 'low';
    } else if (price >= 10000 && price <= 50000) {
      return 'middle';
    } else if (price > 50000) {
      return 'high';
    }
    return false;
  };

  var checkPrise = function (it) {
    return (currentHousingPriceFilter !== 'any') ? currentHousingPriceFilter === getPriceRange(it.offer.price) : true;
  };

  var checkRooms = function (it) {
    return (currentHousingRoomsFilter !== 'any') ? it.offer.rooms === parseInt(currentHousingRoomsFilter, 10) : true;
  };

  var checkGuests = function (it) {
    return (currentHousingGuestsFilter !== 'any') ? it.offer.guests === parseInt(currentHousingGuestsFilter, 10) : true;
  };

  var checkOptions = function (it) {
    var isOptions = [];
    features.forEach(function (feature) {
      if (feature.checked && !it.offer.features.includes(feature.value)) {
        isOptions.push(false);
      } else {
        isOptions.push(true);
      }
    });
    return (!isOptions.includes(false)) ? it : false;
  };

  var filterOffers = function () {
    window.offers.removeOffers();
    var sameOffersPins = offersPins
      .filter(checkType)
      .filter(checkPrise)
      .filter(checkRooms)
      .filter(checkGuests)
      .filter(checkOptions);

    window.offers.renderOffers(sameOffersPins.slice(0, MAX_PINS));
  };

  var successHandler = function (data) {
    offersPins = data;
    filterOffers();
  };

  window.filter = {
    successHandler: successHandler,
    offersPins: offersPins
  };
})();
