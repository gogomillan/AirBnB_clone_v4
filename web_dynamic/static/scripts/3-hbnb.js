/*
  script JavaScript that controls the API status:
  - Request http://0.0.0.0:5001/api/v1/status/:
    - If in the status is OK, add the class available to the DIV#api_status
    - Otherwise, remove the class available to the DIV#api_status
 */
$(document).ready(function () {
  const amnt = {};
  $('input:checkbox').change(function () {
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

function placesSearch() {
  console.log('Entr2a');
  $.ajax({
    type: 'POST',
    url: 'http://localhost:5001/api/v1/places_search/',
    data: '{}',
    contentType: 'application/json',
    dataType: 'json',
    success: function (data) {
      setPlaces(data);
    },
    error: function(err) {
      console.log(err);
    }
  });
}

function setPlaces(places) {
  console.log(places);
}


{/* <article>
	  <div class="title_box">
	    <h2>{{ place.name }}</h2>
	    <div class="price_by_night">${{ place.price_by_night }}</div>
	  </div>
	  <div class="information">
	    <div class="max_guest">{{ place.max_guest }} Guest{% if place.max_guest != 1 %}s{% endif %}</div>
            <div class="number_rooms">{{ place.number_rooms }} Bedroom{% if place.number_rooms != 1 %}s{% endif %}</div>
            <div class="number_bathrooms">{{ place.number_bathrooms }} Bathroom{% if place.number_bathrooms != 1 %}s{% endif %}</div>
	  </div>
	  <div class="user">
            <b>Owner:</b> {{ place.user.first_name }} {{ place.user.last_name }}
          </div>
          <div class="description">
	    {{ place.description | safe }}
          </div>
	</article> */}
