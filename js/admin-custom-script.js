jQuery(document).ready(function($) {
    if (typeof citiesData === 'undefined' || typeof districtsData === 'undefined') {
        return;
    }

    function createDropdown(options, fieldName) {
        var dropdown = $('<select></select>').attr('name', fieldName).attr('id', fieldName);
        $.each(options, function(index, option) {
            dropdown.append($('<option></option>').attr('value', option).text(option));
        });
        dropdown.select2();
        return dropdown;
    }

    function replaceField(field, options, fieldName) {
        if (field.length > 0) {
            var currentValue = field.val();
            field.replaceWith(createDropdown(options, fieldName));
            field = $('select#' + fieldName);
            field.val(currentValue);
            field.select2();
        }
    }

    function updateDistrictField(cityField, districtField, countryField, fieldName) {
        if (cityField.length > 0 && countryField.length > 0) {
            var currentDistrict = districtField.val();
            var initialCountry = countryField.val();
            var initialCity = cityField.val();

            if (initialCountry && initialCity && districtsData[initialCountry] && districtsData[initialCountry][initialCity]) {
                districtField.replaceWith(createDropdown(districtsData[initialCountry][initialCity], fieldName));
                districtField = $('select#' + fieldName);
                districtField.val(currentDistrict);
                districtField.select2();
            }

            cityField.on('change', function() {
                var selectedCity = $(this).val();
                if (districtsData[initialCountry] && districtsData[initialCountry][selectedCity]) {
                    replaceField(districtField, districtsData[initialCountry][selectedCity], fieldName);
                } else {
                    districtField.replaceWith('<input type="text" name="' + fieldName + '" id="' + fieldName + '" />');
                    districtField = $('input#' + fieldName);
                }
            });
        }
    }

    function replaceCityField(cityField, countryField, fieldName) {
        if (cityField.length > 0 && countryField.length > 0) {
            var currentCity = cityField.val();
            var initialCountry = countryField.val();

            if (initialCountry && citiesData[initialCountry]) {
                cityField.replaceWith(createDropdown(citiesData[initialCountry], fieldName));
                cityField = $('select#' + fieldName);
                cityField.val(currentCity);
                cityField.select2();
            }

            countryField.on('change', function() {
                var selectedCountry = $(this).val();
                if (citiesData[selectedCountry]) {
                    replaceField(cityField, citiesData[selectedCountry], fieldName);
                } else {
                    cityField.replaceWith('<input type="text" name="' + fieldName + '" id="' + fieldName + '" />');
                    cityField = $('input#' + fieldName);
                }
            });
        }
    }

    replaceCityField($('#_billing_city'), $('#_billing_country'), '_billing_city');
    updateDistrictField($('#_billing_city'), $('#_billing_address_1'), $('#_billing_country'), '_billing_address_1');

    replaceCityField($('#_shipping_city'), $('#_shipping_country'), '_shipping_city');
    updateDistrictField($('#_shipping_city'), $('#_shipping_address_1'), $('#_shipping_country'), '_shipping_address_1');
});
