/*
  script JavaScript that controls the API status:
  - Request http://0.0.0.0:5001/api/v1/status/:
    - If in the status is OK, add the class available to the DIV#api_status
    - Otherwise, remove the class available to the DIV#api_status
 */
const amnt = {};
const states = {};
const cities = {};

$(document).ready(function () {
  $('input:checkbox.state_checkbox').change(function () {
    const input = $(this)[0];
    const id = input.dataset.id;
    const name = input.dataset.name;

    if ($(this).is(':checked')) {
      states[id] = name;
      checkChildren($(this), true);
    } else {
      delete states[id];
      checkChildren($(this), false);
    }
  });

  $('input:checkbox.city_checkbox').change(function () {
    const input = $(this)[0];
    const id = input.dataset.id;
    const name = input.dataset.name;
    const state = input.dataset.state;

    if ($(this).is(':checked')) {
      cities[id] = name;
    } else {
      const state_checked = $('*[data-id="' + state + '"]');
      delete cities[id];
      state_checked[0].checked = false;
      delete states[state];
    }
  });

  $('input:checkbox.amenity_checkbox').change(function () {
    const input = $(this)[0];
    const id = input.dataset.id;
    const name = input.dataset.name;

    if ($(this).is(':checked')) {
      amnt[id] = name;
    } else {
      delete amnt[id];
    }
    let text = Object.values(amnt).toString().slice(0, 28);
    text += text.length >= 28 ? '...' : '';
    if (text === '') {
      text = '&nbsp;';
    }
    $('#amnts_cheked').html(text);
  });

  $('button').click(function () {
    placesSearch(states, cities, amnt);
  });

  checkStatus();
  placesSearch();
});

function checkStatus () {
  $.ajax({
    url: 'http://localhost:5001/api/v1/status/',
    dataType: 'text',
    success: function (data) {
      const status = JSON.parse(data).status;
      if (status !== 'OK') {
        return;
      }
      if ($('#api_status').hasClass('available')) {
        $('#api_status').removeClass('available');
      } else {
        $('#api_status').addClass('available');
      }
    }
  });
}

function placesSearch (states = null, cities = null, amnt = null) {
  const data = {};

  if (states !== null) {
    data.states = Object.keys(states);
  }
  if (cities !== null) {
    data.cities = Object.keys(cities);
  }
  if (amnt !== null) {
    data.amenities = Object.keys(amnt);
  }

  $.ajax({
    type: 'POST',
    url: 'http://localhost:5001/api/v1/places_search/',
    data: JSON.stringify(data),
    contentType: 'application/json',
    dataType: 'json',
    success: function (data) {
      setPlaces(data);
    },
    error: function (err) {
      console.log(err);
    }
  });
}

function setPlaces (places) {
  const placesTag = $('.places')[0];
  placesTag.innerHTML = '';

  places.forEach(place => {
    const article = document.createElement('article');

    // Title box
    const titleBox = document.createElement('div');
    titleBox.classList.add('title_box');
    const placeName = document.createElement('h2');
    placeName.append(place.name);
    const priceByNight = document.createElement('div');
    priceByNight.classList.add('price_by_night');
    priceByNight.append(place.price_by_night);

    // Information
    const information = document.createElement('div');
    information.classList.add('information');
    const maxGuest = document.createElement('div');
    maxGuest.classList.add('max_guest');
    maxGuest.append(place.max_guest);
    const numberRooms = document.createElement('div');
    numberRooms.classList.add('number_rooms');
    numberRooms.append(place.number_rooms);
    const numberBathRooms = document.createElement('div');
    numberBathRooms.classList.add('number_bathrooms');
    numberBathRooms.append(place.number_bathrooms);

    // Description
    const description = document.createElement('div');
    description.classList.add('description');
    description.innerHTML = place.description;

    // Append to TilteBox
    titleBox.append(placeName);
    titleBox.appendChild(priceByNight);

    // Append to information
    information.appendChild(maxGuest);
    information.appendChild(numberRooms);
    information.appendChild(numberBathRooms);

    // Append to article
    article.appendChild(titleBox);
    article.appendChild(information);
    article.appendChild(description);
    placesTag.appendChild(article);
  });
}

function checkChildren (node, state) {
  const h2 = node[0].parentElement;
  const li = h2.parentElement;
  const ul = li.children[1];
  const elements = ul.children;

  for (let i = 0; i < elements.length; i++) {
    const checkbox = elements[i].children[0];
    const id = checkbox.dataset.id;
    const name = checkbox.dataset.name;
    checkbox.checked = state;
    if (state) {
      cities[id] = name;
    } else {
      delete cities[id];
    }
  }
}
