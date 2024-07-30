jQuery(document).ready(function($) {
    // Check for essential data
    if (typeof citiesData === 'undefined' || typeof districtsData === 'undefined') {
      console.error('Missing required data: citiesData or districtsData');
      return;
    }
  
    // Cache for city options to avoid redundant fetching
    const cityOptionsCache = {};
  
    function createDropdown(options, fieldName) {
      var dropdown = $('<select></select>').attr('name', fieldName).attr('id', fieldName);
      $.each(options, function(index, option) {
        dropdown.append($('<option></option>').attr('value', option).text(option));
      });
      dropdown.select2();
      return dropdown;
    }
  
    function replaceField(field, options, fieldName) {
      console.log('replaceField called with:', field, options, fieldName);
      if (field.length > 0) {
        var currentValue = field.val();
  
        if (options && options.length > 1) { // Check if there are multiple options
          console.log('Creating dropdown');
          field.replaceWith(createDropdown(options, fieldName));
          field = $('select#' + fieldName);
          field.val(currentValue);
          field.select2();
        } else {
          // If only one or no options, keep as text input
          console.log('Keeping as text input');
          field.val(currentValue);
        }
  
        // Trigger a change event on the field's parent to force re-render
        field.parent().trigger('change');
      }
    }
  
    function updateDistrictField(cityField, districtField, countryField, fieldName) {
      if (cityField.length > 0 && countryField.length > 0) {
        var currentDistrict = districtField.val();
  
        cityField.on('change', function() {
          var selectedCountry = countryField.val();
          var selectedCity = $(this).val();
  
          if (districtsData[selectedCountry] && districtsData[selectedCountry][selectedCity]) {
            replaceField(districtField, districtsData[selectedCountry][selectedCity], fieldName);
          } else {
            // If no district data, switch to text input
            districtField.replaceWith('<input type="text" name="' + fieldName + '" id="' + fieldName + '" />');
            districtField = $('input#' + fieldName);
  
            // Remove Select2 elements if they exist
            districtField.parent().find('.select2').remove();
          }
  
          // Update districtField reference and initialize select2 if needed
          districtField = $('#' + fieldName);
          districtField.val(currentDistrict);
          if (districtField.is('select')) {
            districtField.select2();
          }
        });
  
        // Initial update for district field based on page load values
        var initialCountry = countryField.val();
        var initialCity = cityField.val();
  
        // Check for districts immediately
        if (initialCountry && initialCity && districtsData[initialCountry] && districtsData[initialCountry][initialCity]) {
          replaceField(districtField, districtsData[initialCountry][initialCity], fieldName);
        } else if (initialCountry && initialCity && (!districtsData[initialCountry] || !districtsData[initialCountry][initialCity])) {
          districtField.replaceWith('<input type="text" name="' + fieldName + '" id="' + fieldName + '" />');
          districtField = $('input#' + fieldName);
          districtField.val(currentDistrict);
        }
      }
    }
  
    function replaceCityField(cityField, countryField, fieldName) {
      if (cityField.length > 0 && countryField.length > 0) {
        var currentCity = cityField.val();
        var initialCountry = countryField.val();
  
        if (initialCountry && citiesData[initialCountry]) {
          replaceField(cityField, citiesData[initialCountry], fieldName);
          cityField = $('select#' + fieldName);
          cityField.val(currentCity);
          cityField.select2();
        }
  
        countryField.on('change', function() {
          var selectedCountry = $(this).val();
          if (citiesData[selectedCountry]) {
            replaceField(cityField, citiesData[selectedCountry], fieldName);
          } else {
            // If no cities data is available, switch to a text input
            cityField.replaceWith('<input type="text" name="' + fieldName + '" id="' + fieldName + '" />');
            cityField = $('input#' + fieldName);
  
            // Remove Select2 elements if they exist
            cityField.parent().find('.select2').remove();
          }
        });
      }
    }
  
    replaceCityField($('#billing_city'), $('#billing_country'), 'billing_city');
    updateDistrictField($('#billing_city'), $('#billing_address_1'), $('#billing_country'), 'billing_address_1');
  
    replaceCityField($('#shipping_city'), $('#shipping_country'), 'shipping_city');
    updateDistrictField($('#shipping_city'), $('#shipping_address_1'), $('#shipping_country'), 'shipping_address_1');
  });
  