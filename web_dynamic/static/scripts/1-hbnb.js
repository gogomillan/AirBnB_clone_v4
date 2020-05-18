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
  $('input:checkbox').change(function () {
    if($(this).is(":checked")) {
      console.log('checked')
    } else {
      console.log('un-checked')
    }
  });
});
