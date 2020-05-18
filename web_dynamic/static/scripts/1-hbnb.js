/*
  script JavaScript that:
  - It is executed only when DOM is loaded
  - It is used jQuery
  - Listens for changes on each INPUT checkbox tag:
    - if the checkbox is checked, it is stored the Amenity ID in a variable
      (dictionary or list)
    - if the checkbox is unchecked, it is removed the Amenity ID from the
      variable
    - update the H4 tag inside the DIV Amenities with the list of Amenities
      checked
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
});
