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

  $(document).on('click', 'span.review_span', function () {
    if ($(this)[0].innerText === 'Show') {
      findReviews($(this));
    } else {
      removeReviews($(this));
    }
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

    // Reviews
    const reviews = document.createElement('div');
    reviews.classList.add('reviews');
    const reviewTitle = document.createElement('div');
    reviewTitle.classList.add('review_title');
    const reviewB = document.createElement('h3');
    reviewB.append('Reviews');
    const reviewSpan = document.createElement('span');
    reviewSpan.append('Show');
    reviewSpan.classList.add('review_span');
    reviewSpan.setAttribute('data_id', place.id);
    reviewTitle.appendChild(reviewB);
    reviewTitle.appendChild(reviewSpan);
    const reviewList = document.createElement('ul');

    // Append to TilteBox
    titleBox.append(placeName);
    titleBox.appendChild(priceByNight);

    // Append to information
    information.appendChild(maxGuest);
    information.appendChild(numberRooms);
    information.appendChild(numberBathRooms);

    // Append to reviews
    reviews.appendChild(reviewTitle);
    reviews.appendChild(reviewList);

    // Append to article
    article.appendChild(titleBox);
    article.appendChild(information);
    article.appendChild(description);
    article.appendChild(reviews);
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

function findReviews (node) {
  const id = node[0].attributes[1].nodeValue;
  $.ajax({
    url: `http://localhost:5001/api/v1/places/${id}/reviews`,
    contentType: 'application/json',
    dataType: 'json',
    success: function (data) {
      node[0].innerText = 'Hide';
      const reviews = node[0].parentElement.parentElement;
      const revList = reviews.children[1];
      revList.innerHTML = '';
      const reviewTotal = node[0].parentElement.children[0];
      reviewTotal.innerText = '';
      reviewTotal.innerText = data.length + ' Reviews';
      data.forEach(review => {
        const revItem = document.createElement('li');
        const revTitle = document.createElement('h4');
        const d = new Date(review.created_at);
        const monthNames = [
          'January',
          'February', 'March', 'April', 'May', 'June', 'July',
          'August', 'September', 'October', 'November', 'December'
        ];
        const dayPos = ['', 'st', 'nd', 'rd'];
        let day = 'th';
        if (d.getDate() <= 3) {
          day = dayPos[d.getDate()];
        }
        const dat = `
        ${d.getDate() + day} 
        ${monthNames[d.getMonth()]} 
        ${d.getFullYear()}`;

        const userName = review.user.first_name + ' ' + review.user.last_name;

        revTitle.append(`From ${userName} the ${dat}`);
        const revDescription = document.createElement('p');
        revDescription.innerHTML = review.text;
        revItem.appendChild(revTitle);
        revItem.appendChild(revDescription);
        revList.appendChild(revItem);
      });
      reviews.appendChild(revList);
    },
    error: function (err) {
      console.log(err);
    }
  });
}

function removeReviews (node) {
  node[0].innerText = 'Show';
  const reviews = node[0].parentElement.parentElement;
  const revList = reviews.children[1];
  revList.innerHTML = '';
}
